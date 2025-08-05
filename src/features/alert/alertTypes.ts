import type { EntranceExitAnimation } from '../../shared/types/animationTypes';

export type Severity = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';

export interface AlertProps {
  alertOpen: boolean;
  alertSeverity: Severity;
  alertMessage: string;
  alertAnimation: EntranceExitAnimation;
}
