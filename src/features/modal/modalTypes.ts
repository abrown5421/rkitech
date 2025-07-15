import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export interface ModalState {
  modalOpen: boolean;
  modalTitle: string;
  modalType: 'confirm' | 'custom' | null;
  modalProps: Record<string, any> | null;
  modalAnimation: EntranceExitAnimation;
}