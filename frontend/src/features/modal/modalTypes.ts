import type { EntranceAnimation, ExitAnimation } from "../../components/animBox/animBoxTypes";

export interface ModalProps {
    open: boolean;
    closeable: boolean;
    title: string;
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    children: string[];
}

