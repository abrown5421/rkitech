import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Friend, FriendState } from "./friendTypes";

const initialState: FriendState = {
  friends: [],
  requests: [],
  sentRequests: [],
};

const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (_state: FriendState, action: PayloadAction<FriendState>) => {
      return action.payload;
    },
    addFriend(state, action: PayloadAction<Friend>) {
      state.friends.push(action.payload);
    },
    removeFriend(state, action: PayloadAction<string>) {
      state.friends = state.friends.filter((f) => f.id !== action.payload);
      state.requests = state.requests.filter((f) => f.id !== action.payload);
      state.sentRequests = state.sentRequests.filter((f) => f.id !== action.payload);
    },
  },
});

export const { setFriends, addFriend, removeFriend } = friendSlice.actions;
export default friendSlice.reducer;
