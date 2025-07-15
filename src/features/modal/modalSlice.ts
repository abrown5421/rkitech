import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ModalState } from './modalTypes';

const initialState: ModalState = {
  modalOpen: false,
  modalTitle: '',
  modalType: null,
  modalProps: null,
  modalAnimation: {
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
        state.modalOpen = true;
        state.modalTitle = action.payload.title;
        state.modalType = action.payload.modalType;
        state.modalProps = action.payload.modalProps || null;
        state.modalAnimation = {
            entranceAnimation: action.payload.entranceAnimation || 'animate__backInUp',
            exitAnimation: action.payload.exitAnimation || 'animate__backOutDown',
            isEntering: true,
        };
    },
    preCloseModal: (state) => {
      state.modalAnimation.isEntering = false;
    },
    closeModal: (state) => {
        state.modalOpen = false;
        state.modalTitle = '';
        state.modalType = null;
        state.modalProps = null;
        state.modalAnimation = {
            entranceAnimation: 'animate__backInUp',
            exitAnimation: 'animate__backOutDown',
            isEntering: false,
        };
    }

  },
});

export const { openModal, preCloseModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
