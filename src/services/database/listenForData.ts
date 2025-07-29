import { collection, onSnapshot } from "firebase/firestore";
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