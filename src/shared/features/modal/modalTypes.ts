import type { TrianglifyBannerProps } from "../../components/trianglifyBanner/trianglifyBannerTypes";
import type { EntranceExitAnimation } from "../../types/animationTypes";

export interface ModalActionObject {
  modalActionFire: boolean;
  modalActionId: string;
  password?: string;
  idToDelete?: string;
  trianglifyData?: TrianglifyBannerProps | string; 
  imageUrl?: string;
  formData?: Record<string, string | File>;  
}

export interface FormFieldConfig {
  type: 'input' | 'select' | 'textarea' | 'usersearch' | 'imageinput';
  name: string;
  nameId: string;
  required?: boolean;
  creatable?: boolean;
  placeholder?: string;
  inputType?: string;
  step: number;
  options?: string[] | { value: string; label: string }[];
  rows?: number;
  defaultValue?: string;
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
    RecordIdToUpdate?: string;
    uploadDir?: string;
    config?: FormFieldConfig[]; 
    existingData?: Record<string, string>; 
    [key: string]: any;
  };
}