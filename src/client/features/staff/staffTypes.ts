import type { TrianglifyBannerProps } from "../../../shared/components/trianglifyBanner/trianglifyBannerTypes";

export interface StaffMember {
    staffOrder: number;
    staffTitle: string;
    staffUserId: string;
    staffActive: boolean;
}

export interface StaffMemberPlusUser {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    userRole?: 'User' | 'Writer' | 'Editor' | 'Developer' | string;
    createdAt?: string; 
    trianglifyObject?: TrianglifyBannerProps;
    bio?: string;
    gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say' | 'Other';
    phone?: string;
    addressLn1?: string;
    addressLn2?: string;
    addressCity?: string;
    addressState?: string;
    addressPostCode?: string;
    staffTitle: string;
    staffOrder: number;
    staffActive: boolean;
}

export interface Staff {
    staff: StaffMember[];
}