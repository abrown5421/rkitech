import type { EntranceAnimation, ExitAnimation } from "../../frontend/animation/animationTypes";

export interface AnimationPickerProps {
  entranceAnimation?: EntranceAnimation;
  exitAnimation?: ExitAnimation;
  onChange: (changes: { entranceAnimation?: EntranceAnimation; exitAnimation?: ExitAnimation }) => void;
}