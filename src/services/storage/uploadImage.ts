import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadProfileImage = async (file: File, userId: string, dir: string): Promise<string> => {
  if (!file || !userId) throw new Error('Invalid file or user ID');

  const storageRef = ref(storage, `${dir}/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const uploadImage = async (file: File, dir: string): Promise<string> => {
  if (!file) throw new Error('Invalid file or user ID');

  const storageRef = ref(storage, `${dir}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
