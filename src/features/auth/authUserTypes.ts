import type { TrianglifyBannerProps } from "../../shared/components/trianglifyBanner/trianglifyBannerTypes";
import type { FriendMap } from "../friends/friendTypes";

export interface AuthUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    userRole: 'User' | 'Admin' | string;
    createdAt: string; 
    trianglifyObject: TrianglifyBannerProps;
    friends: FriendMap[];
}

export interface AuthUserState {
    user: AuthUser | null;
}