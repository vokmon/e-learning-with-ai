import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { formatDocumentsAsString } from "langchain/util/document";
import path from "path";
import { listFilesInDirectory } from "../utils/file-utils.ts";
import { DocumentData } from "../../../model/document-data.ts";

export async function getPdfDocuments(filePath: string): Promise<DocumentData[]>{
  const files = await listFilesInDirectory(filePath);
  const promises = files.map(async (file) => {
    const loader = new PDFLoader(file, {
      parsedItemSeparator: " ",
    });
    const docs = await loader.load();
    const documentsAsString = formatDocumentsAsString(docs);
    return {
      content: documentsAsString,
      fileName: path.basename(file),
      fullPath: file,
    };
  });

  const documents = await Promise.all(promises);
  return documents;
}
