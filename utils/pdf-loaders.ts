import { DocumentData } from "@/model/document-data";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { formatDocumentsAsString } from "langchain/util/document";
import path from "path";

export async function getPdfDocument(blob: Blob): Promise<string>{
  const loader = new PDFLoader(blob, {
    parsedItemSeparator: " ",
  });
  const docs = await loader.load();
  const documentsAsString = formatDocumentsAsString(docs);
  return documentsAsString;
}
