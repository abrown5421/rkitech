import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type DrawerContentType = 'loggedInMenu' | 'loggedOutMenu' | 'uiEditor' | null;

export interface DrawerState {
  drawerOpen: boolean;
  drawertitle?: string;
  draweranchor?: 'left' | 'right' | 'top' | 'bottom';
  draweranimation: EntranceExitAnimation;
  drawerContentType: DrawerContentType;
}