import type { EntranceExitAnimation } from "../../types/animationTypes";

export type TrianglifyBannerProps = {
  xColors: [string, string];
  yColors: [string, string];
  width: number | string; 
  height: number | string;
  variance?: number;
  cellSize?: number;
  auxImage?: string; 
  TwClassName?: string; 
};

export interface ModalActionObject {
  modalActionFire: boolean;
  modalActionId: string;
  password?: string;
  idToDelete?: string;
  trianglifyData?: TrianglifyBannerProps; 
}

export interface ModalState {
  modalOpen: boolean;
  modalTitle: string;
  modalType: string;
  modalMessage: string;
  modalAnimation: EntranceExitAnimation;
  modalActionFire: ModalActionObject;
  modalProps?: Record<string, any>;
}