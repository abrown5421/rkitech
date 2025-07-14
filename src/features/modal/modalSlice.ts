import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ModalState } from './modalTypes';

const initialState: ModalState = {
  isOpen: false,
  title: '',
  content: null,
  entranceAnimation: 'animate__backInUp',
  exitAnimation: 'animate__backOutDown'
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ title: string; content: ModalState['content']; entranceAnimation: string; exitAnimation: string }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.entranceAnimation = action.payload.entranceAnimation;
      state.exitAnimation = action.payload.exitAnimation;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.content = null;
      state.entranceAnimation = 'animate__backInUp';
      state.exitAnimation = 'animate__backOutDown';
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;