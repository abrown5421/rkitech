import type { TrianglifyBannerProps } from "../../components/trianglifyBanner/trianglifyBannerTypes";
import type { EntranceExitAnimation } from "../../types/animationTypes";

export interface ModalActionObject {
  modalActionFire: boolean;
  modalActionId: string;
  password?: string;
  idToDelete?: string;
  trianglifyData?: TrianglifyBannerProps; 
  imageUrl?: string; 
}

export interface ModalState {
  modalOpen: boolean;
  modalTitle: string;
  modalType: string;
  modalMessage: string;
  modalAnimation: EntranceExitAnimation;
  modalActionFire: ModalActionObject;
  modalProps?: {
    actionId?: string;
    idToDelete?: string;
    requiresAuth?: boolean;
    existingImage?: string;
    [key: string]: any;
  };
}