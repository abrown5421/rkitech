import type { ButtonColor, ButtonVariant } from "./buttonTypes";

export const variantMap: Record<ButtonVariant, string> = {
  solid: '',
  outline: 'bg-transparent border',
  ghost: 'bg-transparent border-transparent',
};

export const colorMap: Record<ButtonColor, string> = {
  primary: 'bg-primary text-white border-primary hover:bg-primary-hover',
  secondary: 'bg-secondary text-white border-secondary hover:bg-secondary-hover',
  success: 'bg-success text-white border-success hover:bg-success-hover',
  error: 'bg-error text-white border-error hover:bg-error-hover',
  warning: 'bg-warning text-black border-warning hover:bg-yellow-hover',
};
