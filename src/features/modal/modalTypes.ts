import type { ReactNode } from 'react';

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
}
