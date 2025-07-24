import { updateEmail } from 'firebase/auth';
import { auth } from '../firebase';

export async function updateAuthEmail(newEmail: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user found.');

  try {
    await updateEmail(user, newEmail);
    console.log('Email updated successfully');
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
}
