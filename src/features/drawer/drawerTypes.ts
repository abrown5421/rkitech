import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export interface DrawerState {
  drawerOpen: boolean;
  drawertitle?: string;
  draweranchor?: 'left' | 'right' | 'top' | 'bottom';
  draweranimation: EntranceExitAnimation;
  drawerchildren?: React.ReactNode; 
}