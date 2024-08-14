import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { Assessment } from "../../model/assessment";
import { app } from "./firebase-app";

const db = getFirestore(app);

export async function getData(collectionName: string): Promise<Assessment[]> {
  const collectionData = collection(db, collectionName);
  const dataSnapshot = await getDocs(collectionData);
  const list = dataSnapshot.docs.map((doc) => doc.data());
  return list as Assessment[];
}

export async function getDataById(
  collectionName: string,
  id: string
): Promise<Assessment> {
  const result = await getDoc(doc(db, collectionName, id));
  const data = result.data();
  return data as unknown as Assessment;
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
