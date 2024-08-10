import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  UploadResult,
} from "firebase/storage";
import { createBlobFromFile } from "../file-utils.ts";
import { fileTypeFromBlob } from "file-type";
import { app } from "./firebase-app.ts";

// https://firebase.google.com/docs/storage/web/upload-files#web_2
export async function saveFileToStorage(
  filePath: string,
  fileName: string,
  bucket: string
) {
  // 'file' comes from the Blob or File API
  const file = await createBlobFromFile(filePath);
  const fileType = await fileTypeFromBlob(file);

  // Create a root reference
  const storage = getStorage(app);
  const storageRef = ref(storage, `${bucket}/${fileName}`);
  const snapshot: UploadResult = await uploadBytes(storageRef, file, {
    contentType: fileType?.mime,
  });
  return snapshot;
}
// https://firebase.google.com/docs/storage/web/download-files
export async function getFileUrl(fullPath: string) {
  const storage = getStorage(app);
  const starsRef = ref(storage, fullPath);

  // Get the download URL
  const url = await getDownloadURL(starsRef);
  return url;
}
