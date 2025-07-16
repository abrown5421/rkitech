import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{
  userId: string;
} | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const userDocRef = doc(db, 'Users', userId);
    await setDoc(userDocRef, {
      firstName,
      lastName,
      email,
      userRole: 'User',
      createdAt: new Date().toISOString(),
    });

    return { userId };
  } catch (error) {
    console.error('Signup failed:', error);
    return null;
  }
}
