import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { AuthUser } from '../../client/features/auth/authUserTypes';
import type { TrianglifyBannerProps } from '../../shared/components/trianglifyBanner/trianglifyBannerTypes';

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  trianglifyObject: TrianglifyBannerProps
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
      profileImage,
      trianglifyObject,
      friends: []
    });

    return {
      userId,
      email,
      firstName,
      lastName,
      userRole: 'User',
      createdAt,
      profileImage,
      trianglifyObject,
      addressCity: '',
      addressState: '',
      addressPostCode: ''
    };
  } catch (error) {
    console.error('Signup failed:', error);
    return null;
  }
}
