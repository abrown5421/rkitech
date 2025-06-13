import { collection, addDoc } from 'firebase/firestore';
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