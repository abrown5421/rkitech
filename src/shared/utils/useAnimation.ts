import clsx from 'clsx';
import type { EntranceExitAnimation, HoverAnimation } from '../types/animationTypes';

export function getEntranceExitClasses(animationObject?: EntranceExitAnimation) {
  if (!animationObject) return '';
  return clsx(
    'animate__animated',
    animationObject.isEntering
      ? animationObject.entranceAnimation
      : animationObject.exitAnimation
  );
}

export function getHoverClasses(animationObject?: HoverAnimation) {
  if (!animationObject) return '';
  return `hover:animate__animated hover:${animationObject.hoverAnimation}`;
}