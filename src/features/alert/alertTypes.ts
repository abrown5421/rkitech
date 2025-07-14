import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type Severity = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  open: boolean;
  severity: Severity;
  message: string;
  animation: EntranceExitAnimation;
}
