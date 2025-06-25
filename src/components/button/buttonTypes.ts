export interface ButtonProps {
  label: React.ReactNode;
  twClasses?: string[];
  onClick?: () => void;
  action?: () => void;
}