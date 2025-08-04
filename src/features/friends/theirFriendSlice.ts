import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FriendState } from "./friendTypes";

const initialState: FriendState = {
  friends: [],
  requests: [],
  sentRequests: [],
};

const theirFriendSlice = createSlice({
  name: "theirFriend",
  initialState,
  reducers: {
    setProfileFriends: (_state: FriendState, action: PayloadAction<FriendState>) => {
      return action.payload;
    },
    clearProfileFriends: () => initialState,
  },
});

export const { setProfileFriends, clearProfileFriends } = theirFriendSlice.actions;
export default theirFriendSlice.reducer;