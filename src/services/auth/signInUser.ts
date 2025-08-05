import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getDocumentById } from '../database/readData';
import type { AuthUser } from '../../client/features/auth/authUserTypes';

export async function signInUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const userData = await getDocumentById('Users', userId) as AuthUser;
    if (!userData) throw new Error('User document not found. Please contact administrator');

    return {
      userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImage: userData.profileImage,
      userRole: userData.userRole,
      createdAt: userData.createdAt,
      trianglifyObject: userData.trianglifyObject,
      addressCity: userData.addressCity,
      addressState: userData.addressState,
      addressPostCode: userData.addressPostCode,
    };
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}
