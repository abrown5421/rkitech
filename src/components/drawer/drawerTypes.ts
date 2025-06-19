
export type DrawerProps = {
  width?: string;
  height?: string;
  orientation?: 'left' | 'right' | 'top' | 'bottom';
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};