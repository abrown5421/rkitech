import type { EntranceExitAnimation } from "../../types/animationTypes";

export type ModalContentType = 'confirm' | 'deleteAccount' | 'disableAccount' | 'editProfilePic' | 'editProfileBanner' | 'newBlogPost' | 'form' | null;

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

export interface ProfileBannerModalContentProps {
  yColors?: [string, string];
  xColors?: [string, string];
  auxImage?: string | null;
  cellSize?: number;
  variance?: number;
  onSave?: (data: {
    yColors: [string, string];
    xColors: [string, string];
    auxImage: string | null;
    cellSize: number;
    variance: number;
  }) => void;
}