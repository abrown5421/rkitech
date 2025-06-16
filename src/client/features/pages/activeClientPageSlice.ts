import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActiveClientPageState } from "./activeClientPageTypes";

const initialState: ActiveClientPageState = {
  activeClientPageName: "Home",
  activeClientPageIn: true,
  activeClientPageId: "",
};

const activeClientPageSlice = createSlice({
  name: "activeClientPage",
  initialState,
  reducers: {
    setActiveClientPage: <K extends keyof ActiveClientPageState>(
      state: ActiveClientPageState,
      action: PayloadAction<{ key: K; value: ActiveClientPageState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setEntireActiveClientPageState(_, action: PayloadAction<ActiveClientPageState>) {
        return action.payload;
    },
  },
});

export const { setActiveClientPage, setEntireActiveClientPageState } = activeClientPageSlice.actions;
export default activeClientPageSlice.reducer;