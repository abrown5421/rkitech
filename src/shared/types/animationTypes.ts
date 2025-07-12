export type EntranceExitAnimation = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type HoverAnimation = {
  hoverAnimation: string;
};

export type AnimationProps =
  | { entranceExit: EntranceExitAnimation; hover?: never }
  | { hover: HoverAnimation; entranceExit?: never }
  | {}; 