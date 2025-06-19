import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export async function signOutUser(): Promise<boolean> {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return false;
  }
}
