export interface AuthUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    userRole: 'User' | 'Admin' | string;
    createdAt: string; 
}

export interface AuthUserState {
    user: AuthUser | null;
}