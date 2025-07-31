import { getStorage, ref, deleteObject } from 'firebase/storage';

export const deleteImageFromStorage = async (imageUrl: string) => {
  const storage = getStorage();
  const decodedUrl = decodeURIComponent(imageUrl.split('?')[0]);
  const pathStartIndex = decodedUrl.indexOf('/o/') + 3;
  const path = decodedUrl.substring(pathStartIndex);

  const imageRef = ref(storage, path);
  await deleteObject(imageRef);
};