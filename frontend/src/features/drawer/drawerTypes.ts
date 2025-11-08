import type { EntranceAnimation, ExitAnimation } from "../../components/animBox/animBoxTypes";

export type DrawerOrientation =
    | "top"
    | "right"
    | "bottom"
    | "left";

export interface DrawerProps {
    open: boolean;
    screenPercentage: number,
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    orientation?: DrawerOrientation;
    backgroundColor: string; 
    children: string[];
    isClosing?: boolean; 
}
