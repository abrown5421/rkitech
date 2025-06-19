export interface AuthenticatedUser {
  userLastName: string;
  userEmail: string;
  userFirstName: string;
  userImage: string;
  userRole: string;
}

export interface UserState {
  userId: string;
  authenticatedUser: AuthenticatedUser | null;
}