import type { TrianglifyBannerProps } from "../../shared/components/trianglifyBanner/trianglifyBannerTypes";

export interface AuthUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    userRole: 'User' | 'Admin' | string;
    createdAt: string; 
    trianglifyObject: TrianglifyBannerProps;
}

export interface AuthUserState {
    user: AuthUser | null;
}