import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ModalActionObject, ModalState } from './modalTypes';

const initialState: ModalState = {
  modalOpen: false,
  modalTitle: '',
  modalType: '',
  modalMessage: '',
  modalAnimation: {
    entranceAnimation: 'animate__backInUp',
    exitAnimation: 'animate__backOutDown',
    isEntering: false,
  },
  modalActionFire: { modalActionFire: false, modalActionId: '' },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title: string;
        modalType: string;
        modalMessage?: string;
        modalProps?: Record<string, any>;
        entranceAnimation?: string;
        exitAnimation?: string;
      }>
    ) => {
      state.modalOpen = true;
      state.modalTitle = action.payload.title;
      state.modalType = action.payload.modalType;
      state.modalMessage = action.payload.modalMessage || '';
      state.modalAnimation = {
        entranceAnimation: action.payload.entranceAnimation || 'animate__backInUp',
        exitAnimation: action.payload.exitAnimation || 'animate__backOutDown',
        isEntering: true,
      };
      state.modalActionFire = { modalActionFire: false, modalActionId: '' };
      state.modalProps = action.payload.modalProps || {};
    },
    preCloseModal: (state) => {
      state.modalAnimation.isEntering = false;
    },
    fireModalAction: (state, action: PayloadAction<ModalActionObject>) => {
      state.modalActionFire = action.payload;
    },
    closeModal: () => initialState,
  },
});

export const { openModal, preCloseModal, fireModalAction, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
