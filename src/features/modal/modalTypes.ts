import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type ModalContentType = 'confirm' | 'editProfile' | 'form' | null;

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
  email: string;
  onSave: (updatedData: { firstName: string; lastName: string; email: string }) => void;
  onCancel: () => void;
}