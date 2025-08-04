export interface Notification {
  id: string
  userId: string, 
  type: "friend_request" | "comment"  
  isRead: boolean,
  createdAt: string,
  targetPageName: string,
}

export interface NotificationState {
  notifications: Notification[];
}