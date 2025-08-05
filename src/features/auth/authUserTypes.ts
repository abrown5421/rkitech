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
    bio?: string;
    gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say' | 'Other'
    phone?: string;
    addressLn1?: string;
    addressLn2?: string;
    addressCity: string;
    addressState: string;
    addressPostCode: string;

}

export interface AuthUserState {
    user: AuthUser | null;
}