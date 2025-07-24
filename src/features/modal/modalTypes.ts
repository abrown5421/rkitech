import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type ModalContentType = 'confirm' | 'custom' | 'form' | null;

export interface ModalState {
  modalOpen: boolean;
  modalTitle: string;
  modalType: ModalContentType;
  modalProps: Record<string, any> | null;
  modalAnimation: EntranceExitAnimation;
}
