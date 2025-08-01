import type { AuthUser } from "../auth/authUserTypes";

export interface Friend {
  id: string; 
  requesterId: string;
  requesteeId: string;
  status: string;
  seenByRequestee: boolean
  createdAt: string;
  acceptedAt: string;
}

export interface FriendState {
  friends: Friend[];
  requests: Friend[];
  sentRequests: Friend[];
}

export interface FriendProfileModuleState {
  profileUser: AuthUser
}