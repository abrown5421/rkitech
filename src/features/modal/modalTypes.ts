import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export interface ModalState {
  isOpen: boolean;
  title: string;
  modalType: 'confirm' | 'custom' | null;
  modalProps: Record<string, any> | null;
  animation: EntranceExitAnimation;
}