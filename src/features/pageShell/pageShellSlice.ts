import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActivePageShellState } from "./pageShellTypes";

const initialState: ActivePageShellState = {
  activePageShellName: "Home",
  activePageShellIn: true,
  activePageShellId: ""
};

const activePageShellSlice = createSlice({
  name: "activePageShell",
  initialState,
  reducers: {
    setPartOfActivePageShell: <K extends keyof ActivePageShellState>(
      state: ActivePageShellState,
      action: PayloadAction<{ key: K; value: ActivePageShellState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setEntireActivePageShellState(_, action: PayloadAction<ActivePageShellState>) {
        return action.payload;
    },
  },
});

export const { setPartOfActivePageShell, setEntireActivePageShellState } = activePageShellSlice.actions;
export default activePageShellSlice.reducer;