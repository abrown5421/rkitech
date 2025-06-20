export type FormField = {
  formFieldLabel: string;
  formFieldType: string;
  formFieldPlaceholder?: string;
  formFieldName: string;
  formFieldRequired?: boolean;
};

export type CMSForm = {
  formName: string;
  formFields: FormField[];
  requireCaptcha?: boolean;
};

export interface FormProps {
  formName: string;
  twClasses?: string[]; 
}