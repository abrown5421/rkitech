export interface UnhealthyProps {
    error: string;
}

export interface HealthyProps {
    progress: number
}

export interface HealthCheck {
  name: string;
  check: () => Promise<{ success: boolean; error?: string }>;
}