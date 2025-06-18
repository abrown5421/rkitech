import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActiveAdminPageState } from "./activeAdminPageTypes";

const initialState: ActiveAdminPageState = {
  activeAdminPageName: "Home",
  activeAdminPageIn: true,
};

const activeAdminPageSlice = createSlice({
  name: "activeAdminPage",
  initialState,
  reducers: {
    setActiveAdminPage: <K extends keyof ActiveAdminPageState>(
      state: ActiveAdminPageState,
      action: PayloadAction<{ key: K; value: ActiveAdminPageState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setEntireActiveAdminPageState(_, action: PayloadAction<ActiveAdminPageState>) {
        return action.payload;
    },
  },
});

export const { setActiveAdminPage, setEntireActiveAdminPageState } = activeAdminPageSlice.actions;
export default activeAdminPageSlice.reducer;