import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
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