import Cookies from 'js-cookie';
import type { AuthenticatedUser } from '../admin/features/auth/authTypes';
import { getDocumentById } from '../services/database/readData';

export async function useCookieToAuth(): Promise<{
  userId: string;
  user: AuthenticatedUser;
} | null> {
  const userId = Cookies.get('adminUserId');
  if (!userId) return null;

  try {
    const userData = await getDocumentById('Users', userId);
    if (!userData) throw new Error('User not found');

    return {
      userId,
      user: {
        userFirstName: userData.userFirstName,
        userImage: userData.userImage,
        userLastName: userData.userLastName,
        userEmail: userData.userEmail,
        userRole: userData.userRole,
      },
    };
  } catch (error) {
    console.error('Failed to load user from cookie:', error);
    return null;
  }
}
