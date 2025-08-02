import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { AuthUser } from '../../features/auth/authUserTypes';

export async function getDocumentById<T>(collectionName: string, docId: string): Promise<(T & { userId: string }) | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { userId: docSnap.id, ...docSnap.data() } as T & { userId: string };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

export async function getDocumentByCondition(
  collectionName: string, 
  conditionField: string, 
  conditionValue: any
): Promise<any[] | null> {
  try {
    const collectionRef = collection(db, collectionName);

    const q = query(collectionRef, where(conditionField, "==", conditionValue));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No matching documents!');
      return null;
    }

    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error("Error getting documents by condition: ", error);
    return null;
  }
}

export async function getEntireCollection(collectionName: string): Promise<any[] | null> {
  try {
    const collectionRef = collection(db, collectionName);

    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      console.log('No documents found in the collection!');
      return null;
    }

    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return null;
  }
}

export async function searchUsers(input: string): Promise<AuthUser[]> {
  if (!input.trim()) return [];

  const usersRef = collection(db, "Users");
  const snapshot = await getDocs(usersRef);

  const search = input.toLowerCase();

  const results: AuthUser[] = [];
  snapshot.forEach((doc) => {
    const { userId, ...rest } = doc.data() as AuthUser;
    const matches =
      rest.firstName?.toLowerCase().includes(search) ||
      rest.lastName?.toLowerCase().includes(search) ||
      rest.email?.toLowerCase().includes(search);

    if (matches) {
      results.push({ userId: doc.id, ...rest });
    }
  });

  return results;
}