import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

export function listenToCollection(collectionName: string, callback: (data: any[]) => void) {
  const colRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });

  return unsubscribe; }

export function listenToDocument(
  collectionName: string,
  docId: string,
  callback: (data: any | null) => void
) {
  const docRef = doc(db, collectionName, docId);

  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      });
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

