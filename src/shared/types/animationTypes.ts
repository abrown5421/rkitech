export type EntranceExitAnimation = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type HoverAnimationBase = {
  hoverAnimation: string;
};

export type HoverAnimationInfinite = HoverAnimationBase & {
  infinite: true;
  repeat?: never;
};

export type HoverAnimationRepeat = HoverAnimationBase & {
  repeat: number;
  infinite?: never;
};

export type HoverAnimation = HoverAnimationInfinite | HoverAnimationRepeat;

export type AnimationProps =
  | { entranceExit: EntranceExitAnimation; hover?: never }
  | { hover: HoverAnimation; entranceExit?: never }
  | {}; 