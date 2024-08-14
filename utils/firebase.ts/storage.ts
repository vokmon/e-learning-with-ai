import {
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import { app } from "./firebase-app";


// https://firebase.google.com/docs/storage/web/download-files
export async function getFileUrl(fullPath: string) {
  const storage = getStorage(app);
  const starsRef = ref(storage, fullPath);

  // Get the download URL
  const url = await getDownloadURL(starsRef);
  return url;
}

export async function getFileBlob(fullPath: string) {
  // getBlob from the sdk does not work
  // Error: getBlob() is only available in Browser-like environments
  
  const url = await getFileUrl(fullPath);
  const response = await fetch(url);
  const blob = await response.blob();
  return(blob);
}
