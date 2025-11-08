import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ModalProps } from "./modalTypes";

const defaultModalState: ModalProps = {
  open: false,
  closeable: true,
  title: "",
  entrance: undefined,
  exit: undefined,
  children: [],
  backgroundColor: "$theme.neutral.main"
};

const initialState: ModalProps = { ...defaultModalState };

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (_state, action: PayloadAction<ModalProps>) => {
      return { ...action.payload, open: true };
    },
    closeModal: () => {
      return { ...defaultModalState };
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
