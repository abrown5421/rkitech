export type Severity = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
    open: boolean;
    severity: Severity;
    message: string;
}