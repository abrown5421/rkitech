import type { EntranceAnimation, ExitAnimation } from "../animation/animationTypes";

export type AlertOrientation =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export type Severities = "success" | "warning" | "error" | "primary" | "secondary" | "accent" | "neutral" | "neutral2" | "neutral3";

export interface AlertProps {
    open: boolean;
    body: string;
    closeable: boolean;
    severity: Severities,
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    orientation?: AlertOrientation; 
}