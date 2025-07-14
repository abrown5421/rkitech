export type LoaderVariant = "flash" | "bounce" | "rubberBand" | "heartBeat" | "spinner";

export interface LoaderProps {
  variant?: LoaderVariant;
  color?: string; 
  size?: number; 
}