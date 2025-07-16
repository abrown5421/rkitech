import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { AuthUser } from '../../features/auth/authUserTypes';

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthUser | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const createdAt = new Date().toISOString();

    const userDocRef = doc(db, 'Users', userId);
    await setDoc(userDocRef, {
      firstName,
      lastName,
      email,
      userRole: 'User',
      createdAt,
    });

    return {
      userId,
      email,
      firstName,
      lastName,
      userRole: 'User',
      createdAt,
    };
  } catch (error) {
    console.error('Signup failed:', error);
    return null;
  }
}
