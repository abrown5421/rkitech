import type { AuthUser } from "../auth/authUserTypes";

export interface FriendMap {
    friends: boolean,
    requester: string,
    requestee: string,
    seen: boolean,
    friendAvi: string,
    friendId: string,
}

export interface FriendProfileModuleProps {
  profileUser: AuthUser;
}