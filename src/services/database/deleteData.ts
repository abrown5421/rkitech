import { doc, deleteDoc, updateDoc, deleteField, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    console.log(`Document with ID "${documentId}" successfully deleted from collection "${collectionName}".`);
  } catch (error) {
    console.error(`Failed to delete document with ID "${documentId}" from collection "${collectionName}":`, error);
    throw error;
  }
}

export async function deleteFieldFromDocument(
  collectionName: string,
  documentId: string,
  fieldName: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Document with ID "${documentId}" does not exist in collection "${collectionName}".`);
    }

    if (fieldName in docSnap.data()) {
      await updateDoc(docRef, {
        [fieldName]: deleteField()
      });
      console.log(`Field "${fieldName}" successfully deleted from document "${documentId}" in collection "${collectionName}".`);
    } else {
      console.log(`Field "${fieldName}" does not exist in document "${documentId}". No changes made.`);
    }
  } catch (error) {
    console.error(`Failed to delete field "${fieldName}" from document "${documentId}" in collection "${collectionName}":`, error);
    throw error;
  }
}