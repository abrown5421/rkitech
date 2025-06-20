import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  open: boolean;
  modalID: string;
  modalTitle: string;
  modalBody: string;
  twClasses?: string[];
  secondaryClasses?: string[];
}

const initialState: ModalState = {
  open: false,
  modalID: '',
  modalTitle: '',
  modalBody: '',
  twClasses: [],
  secondaryClasses: [],
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<Partial<ModalState>>
    ) => {
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    },
    closeModal: (state) => {
      state.open = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
