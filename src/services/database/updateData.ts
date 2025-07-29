import { doc, updateDoc } from 'firebase/firestore';
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