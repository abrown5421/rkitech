import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export async function updateAuthProfile(
  updatedFields: { displayName?: string; photoURL?: string }
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user found.');

  try {
    await updateProfile(user, updatedFields);
    console.log('Auth profile updated successfully');
  } catch (error) {
    console.error('Error updating auth profile:', error);
    throw error;
  }
}
