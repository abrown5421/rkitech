import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ActiveModuleState } from "./activeModuleTypes";

const initialState: ActiveModuleState = {
  activeModuleName: "Client",
  activeModuleIn: true,
};

const activeModuleSlice = createSlice({
  name: "activeModule",
  initialState,
  reducers: {
    setActiveModule: <K extends keyof ActiveModuleState>(
      state: ActiveModuleState,
      action: PayloadAction<{ key: K; value: ActiveModuleState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    }
  },
});

export const { setActiveModule } = activeModuleSlice.actions;
export default activeModuleSlice.reducer;