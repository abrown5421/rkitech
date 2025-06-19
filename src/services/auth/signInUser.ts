import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getDocumentById } from '../database/readData';
import type { AuthenticatedUser } from '../../admin/features/auth/authTypes';

export async function signInUser(email: string, password: string): Promise<{
  userId: string;
  user: AuthenticatedUser;
} | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const userData = await getDocumentById('Users', userId);
    if (!userData) throw new Error('User document not found');

    const authenticatedUser: AuthenticatedUser = {
      userFirstName: userData.userFirstName,
      userLastName: userData.userLastName,
      userEmail: userData.userEmail,
      userRole: userData.userRole,
    };

    return {
      userId,
      user: authenticatedUser,
    };
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}
