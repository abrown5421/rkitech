import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DrawerProps } from "./drawerTypes";

const defaultDrawerState: DrawerProps = {
  open: false,
  title: "",
  screenPercentage: 25,
  entrance: undefined, 
  exit: undefined,
  backgroundColor: "",
  children: [],
};

const initialState: DrawerProps = { ...defaultDrawerState };

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer: (_state, action: PayloadAction<DrawerProps>) => {
      return { ...action.payload, open: true };
    },
    closeDrawer: () => {
      return { ...defaultDrawerState };
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
