import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function updateDataInCollection(
  collectionName: string,
  docId: string,
  updatedFields: Record<string, any>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedFields);
    console.log(`Document with ID ${docId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating document with ID ${docId}:`, error);
    throw error;
  }
}

export async function updateTrianglifyAuxImage(
  collectionName: string,
  docId: string,
  auxImageValue: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      "trianglifyObject.auxImage": auxImageValue
    });

    console.log(`auxImage updated successfully for document ${docId}.`);
  } catch (error) {
    console.error(`Error updating auxImage for document ${docId}:`, error);
    throw error;
  }
}

export async function appendToArrayInCollection(
  collectionName: string,
  docId: string,
  arrayField: string,
  value: any
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      [arrayField]: arrayUnion(value),
    });
    console.log(`Appended to ${arrayField} in document ${docId} successfully.`);
  } catch (error) {
    console.error(`Error appending to array field ${arrayField} in document ${docId}:`, error);
    throw error;
  }
}

export async function removeFromArrayInCollection(
  collectionName: string,
  docId: string,
  arrayField: string,
  value: any
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { [arrayField]: arrayRemove(value) });
  console.log(`Removed from ${arrayField} in ${docId}`);
}

export async function removeFromArrayByCondition(
  collectionName: string,
  docId: string,
  arrayField: string,
  matchFn: (item: any) => boolean
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error(`Document ${docId} does not exist in collection ${collectionName}`);
  }

  const data = docSnap.data();
  const array = data[arrayField] || [];

  const updatedArray = array.filter((item: any) => !matchFn(item));

  await updateDoc(docRef, { [arrayField]: updatedArray });
  console.log(`Filtered ${arrayField} in ${docId}`);
}