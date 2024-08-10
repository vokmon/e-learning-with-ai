import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { Assessment } from "model/assessment.ts";
import { app } from "./firebase-app.ts";

const db = getFirestore(app);

export async function getData(collectionName: string) {
  const collectionData = collection(db, collectionName);
  const dataSnapshot = await getDocs(collectionData);
  const list = dataSnapshot.docs.map((doc) => doc.data());
  return list;
}

export async function checkFileExists(
  collectionName: string,
  fileName: string
) {
  const q = query(
    collection(db, collectionName),
    where("fileName", "==", fileName)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    return true;
  }
  return false;
}

export async function saveDataToFireStore(
  collectionName: string,
  data: Assessment
) {
  try {
    await setDoc(doc(db, collectionName, data.id), data);
  } catch (e) {
    console.error("Failed insert data", e);
  }
}
