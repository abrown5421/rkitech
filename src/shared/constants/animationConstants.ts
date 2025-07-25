import type { AnimationConfig } from "../types/animationTypes";

export const getAnimationClasses = (animation?: AnimationConfig): string => {
  if (!animation) return '';
  const { entrance, exit, isEntering, speed } = animation;

  return [
    'animate__animated',
    isEntering ? entrance : exit,
    speed || '',
  ]
    .filter(Boolean)
    .join(' ');
};


export const getAnimationStyles = (animation?: AnimationConfig): React.CSSProperties => {
  const styles: React.CSSProperties = {};

  if (animation?.delay) {
    styles.animationDelay = animation.delay;
  }

  return styles;
};
