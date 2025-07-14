import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ModalState } from './modalTypes';

const initialState: ModalState = {
  isOpen: false,
  title: '',
  modalType: null,
  modalProps: null,
  animation: {
    entranceAnimation: 'animate__backInUp',
    exitAnimation: 'animate__backOutDown',
    isEntering: false,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
        state,
        action: PayloadAction<{
            title: string;
            modalType: ModalState['modalType'];
            modalProps?: Record<string, any>;
            entranceAnimation?: string;
            exitAnimation?: string;
        }>
        ) => {
        state.isOpen = true;
        state.title = action.payload.title;
        state.modalType = action.payload.modalType;
        state.modalProps = action.payload.modalProps || null;
        state.animation = {
            entranceAnimation: action.payload.entranceAnimation || 'animate__backInUp',
            exitAnimation: action.payload.exitAnimation || 'animate__backOutDown',
            isEntering: true,
        };
    },
    preCloseModal: (state) => {
      state.animation.isEntering = false;
    },
    closeModal: (state) => {
        state.isOpen = false;
        state.title = '';
        state.modalType = null;
        state.modalProps = null;
        state.animation = {
            entranceAnimation: 'animate__backInUp',
            exitAnimation: 'animate__backOutDown',
            isEntering: false,
        };
    }

  },
});

export const { openModal, preCloseModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
