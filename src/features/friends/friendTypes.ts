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

