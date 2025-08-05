import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "./notificationTypes";

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
