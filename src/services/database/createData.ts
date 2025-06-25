import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db } from '../firebase';

export async function insertDataIntoCollection(collectionName: string, data: Record<string, any>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`Document written with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
}

export async function insertDataIntoDocumentFieldArray(
  collectionName: string,
  documentId: string,
  fieldName: string,
  data: Record<string, any>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [fieldName]: arrayUnion(data),
    });
    console.log(`Data inserted into ${fieldName} field of document ${documentId}`);
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
    throw error;
  }
}