import type { ButtonColor, ButtonVariant } from "./buttonTypes";

export const variantBaseMap: Record<ButtonVariant, string> = {
  solid: 'border-1',
  outline: 'bg-transparent border-1',
  ghost: 'bg-transparent border-transparent',
};

export const colorStyles: Record<
  ButtonVariant,
  Record<
    ButtonColor,
    {
      text: string;
      bg: string;
      border: string;
      hoverBg: string;
      hoverText: string;
      hoverBorder?: string;
    }
  >
> = {
  solid: {
    primary: {
      text: 'text-white',
      bg: 'bg-primary',
      border: 'border-primary',
      hoverBg: 'hover:bg-transparent',
      hoverText: 'hover:text-primary',
      hoverBorder: 'hover:border-primary',
    },
    secondary: {
      text: 'text-white',
      bg: 'bg-secondary',
      border: 'border-secondary',
      hoverBg: 'hover:bg-transparent',
      hoverText: 'hover:text-secondary',
      hoverBorder: 'hover:border-secondary',
    },
    success: {
      text: 'text-white',
      bg: 'bg-success',
      border: 'border-success',
      hoverBg: 'hover:bg-transparent',
      hoverText: 'hover:text-success',
      hoverBorder: 'hover:border-success',
    },
    error: {
      text: 'text-white',
      bg: 'bg-error',
      border: 'border-error',
      hoverBg: 'hover:bg-transparent',
      hoverText: 'hover:text-error',
      hoverBorder: 'hover:border-error',
    },
    warning: {
      text: 'text-black',
      bg: 'bg-warning',
      border: 'border-warning',
      hoverBg: 'hover:bg-yellow-hover',
      hoverText: 'hover:text-yellow-hover',
      hoverBorder: 'hover:border-warning',
    },
  },
  outline: {
    primary: {
      text: 'text-primary',
      bg: 'bg-transparent',
      border: 'border-primary',
      hoverBg: 'hover:bg-primary',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-primary',
    },
    secondary: {
      text: 'text-secondary',
      bg: 'bg-transparent',
      border: 'border-secondary',
      hoverBg: 'hover:bg-secondary',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-secondary',
    },
    success: {
      text: 'text-success',
      bg: 'bg-transparent',
      border: 'border-success',
      hoverBg: 'hover:bg-success',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-success',
    },
    error: {
      text: 'text-error',
      bg: 'bg-transparent',
      border: 'border-error',
      hoverBg: 'hover:bg-error',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-error',
    },
    warning: {
      text: 'text-warning',
      bg: 'bg-transparent',
      border: 'border-warning',
      hoverBg: 'hover:bg-yellow-hover',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-warning',
    },
  },
  ghost: {
    primary: {
      text: 'text-primary',
      bg: 'bg-transparent',
      border: 'border-transparent',
      hoverBg: '',
      hoverText: 'hover:text-black',
    },
    secondary: {
      text: 'text-secondary',
      bg: 'bg-transparent',
      border: 'border-transparent',
      hoverBg: '',
      hoverText: 'hover:text-black',
    },
    success: {
      text: 'text-success',
      bg: 'bg-transparent',
      border: 'border-transparent',
      hoverBg: '',
      hoverText: 'hover:text-black',
    },
    error: {
      text: 'text-error',
      bg: 'bg-transparent',
      border: 'border-transparent',
      hoverBg: '',
      hoverText: 'hover:text-black',
    },
    warning: {
      text: 'text-warning',
      bg: 'bg-transparent',
      border: 'border-transparent',
      hoverBg: '',
      hoverText: 'hover:text-black',
    },
  },
};

