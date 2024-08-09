import { JsonOutputParser } from "@langchain/core/output_parsers";
import ora from "ora";
import { put, PutBlobResult } from "@vercel/blob";
import { getPdfDocuments } from "./loaders/pdf-loaders.ts";
import { generateAssignmentTemplate } from "./prompts/assessment-prompt.ts";
import { getChain } from "./utils/chain.ts";
import { rl } from "./utils/user-input.ts";
import { createBlobFromFile } from "./utils/file-utils.ts";
import { DocumentData } from "../../model/document-data.ts";
import { Assessment, AssessmentFromLlm } from "../../model/assessment.js";
import { checkFileExists, saveDataToFireStore } from "./utils/firestore.ts";


const summaryChain = await getChain(generateAssignmentTemplate, new JsonOutputParser());

const timeLabel = "Article upload";
const collectionName = process.env.FIREBASE_ARTICLE_ASSESSMENT_COLLECTION!;

rl.question("Enter path path to load the documents: ", async (path: string) => {
  console.time(timeLabel);
  let loader = ora(`Start uploading file(s) from ${path}`).info();
  loader = loader.start(`Loading files from ${path}`);
  const docs = await getPdfDocuments(path);
  loader = loader.succeed(`Loaded file(s) from ${path}`);
  loader.indent = loader.indent + 2;
  // Generate the data one at a time to avoid the rate limit.
  for (const doc of docs) {
    const isFileExisted = await checkFileExists(collectionName, doc.fileName);
    if (isFileExisted) {
      loader.info(`File ${doc.fileName} has been uploaded.`);
      continue;
    }

    loader = loader.start(`Generating assessment and uploading file to the server. File: ${doc.fileName}`);

    const resolve = await Promise.all([generateAssessment(doc), uploadFile(doc)]);
    const assessment: AssessmentFromLlm = resolve[0];
    const fileUpload: PutBlobResult = resolve[1];

    loader = loader.succeed(`Generated assessment and uploading file to the server. File: ${doc.fileName}`);
    loader.indent = loader.indent + 2;
    loader = loader.succeed(`Generated assessment`);
    loader = loader.succeed(`Uploaded file`);

    const result: Assessment = {
      id: crypto.randomUUID(),
      fileName: doc.fileName,
      url: fileUpload.url,
      createdAt: new Date(),
      ...assessment,
    }

    loader = loader.start(`Saving data to the database`);
    await saveDataToFireStore(collectionName, result);
    loader = loader.succeed(`Save data to the database`);
    // console.log(JSON.stringify(result));
    loader.indent = loader.indent - 2;
  }

  loader.indent = loader.indent - 2;
  loader = loader.info(`Finish uploading the article.`);
  console.log("\n");
  console.timeEnd(timeLabel);
  process.exit(0);
});

async function generateAssessment(doc: DocumentData): Promise<AssessmentFromLlm> {
  const assesment = await summaryChain.invoke({text: doc.content, numberOfQuestions: '5', numberOfChoices: '4'})
  return assesment as AssessmentFromLlm;
}

async function uploadFile(doc: DocumentData): Promise<PutBlobResult> {
  const file = await createBlobFromFile(doc.fullPath);
  const result = await put(doc.fileName, file, { access: 'public' });
  return result;
}

