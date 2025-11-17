import type { EntranceAnimation, ExitAnimation } from "../../components/animBox/animBoxTypes";

export interface ModalProps {
    open: boolean;
    closeable: boolean;
    title: string;
    body?: string;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    children?: string[];
    backgroundColor: string; 
    prefab?: "confirm" | "confirmDeny" | string;
    onConfirm?: () => void;
    onDeny?: () => void;
    callbackKey?: string;
}

