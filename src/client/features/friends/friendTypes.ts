import type { ClientAuthUser } from "../auth/ClientAuthUserTypes";

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
  profileUser: ClientAuthUser
}

export type FriendStatus = 'received' | 'sent' | 'accepted';

export interface FriendCardProps {
  friend: ClientAuthUser;
  meta: Friend & { source: FriendStatus };
  isLoading?: boolean;
  onAction?: (action: 'accept' | 'decline' | 'unfriend' | 'rescind', friendId: string) => void;
}

export interface ActionConfig {
  primary?: {
    label: string;
    icon: string;
    className: string;
    action: () => void;
  };
  secondary?: {
    label: string;
    icon: string;
    className: string;
    action: () => void;
  };
}