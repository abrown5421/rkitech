import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type ModalContentType = 'confirm' | 'editProfile' | 'editProfilePic' | 'form' | null;

export interface ModalState {
  modalOpen: boolean;
  modalTitle: string;
  modalType: ModalContentType;
  modalProps: Record<string, any> | null;
  modalAnimation: EntranceExitAnimation;
}

export interface EditProfileModalProps {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  password: string;
  onSave: (updatedData: { firstName: string; lastName: string; email: string; password: string; }) => void;
  onCancel: () => void;
}