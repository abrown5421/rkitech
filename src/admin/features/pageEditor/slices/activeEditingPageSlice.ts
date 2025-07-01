import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActiveEditingPageState } from "../types/activeEditingPageTypes";

const initialState: ActiveEditingPageState = {
  activeEditingPageName: "Home",
  activeEditingPageIn: true,
  activeEditingPageId: "",
};

const activeEditingPageSlice = createSlice({
  name: "activeEditingPage",
  initialState,
  reducers: {
    setActiveEditingPage: <K extends keyof ActiveEditingPageState>(
      state: ActiveEditingPageState,
      action: PayloadAction<{ key: K; value: ActiveEditingPageState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setEntireActiveEditingPageState(_, action: PayloadAction<ActiveEditingPageState>) {
        return action.payload;
    },
  },
});

export const { setActiveEditingPage, setEntireActiveEditingPageState } = activeEditingPageSlice.actions;
export default activeEditingPageSlice.reducer;