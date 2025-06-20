import type { ReactNode } from "react";

export interface ModalProps {
  modalID: string;
  modalTitle: string;
  modalBody: string;
  modalAction: (requestClose: () => void) => ReactNode;
  onClose: () => void;
  twClasses?: string[];
  secondaryClasses?: string[];
}