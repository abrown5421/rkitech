import clsx from 'clsx';
import type { AnimationProps, EntranceExitAnimation, HoverAnimation } from '../types/animationTypes';

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
  return `animate__animated ${animationObject.hoverAnimation}`;
}

export function isEntranceExitAnimation(anim: AnimationProps | undefined): anim is { entranceExit: EntranceExitAnimation } {
  return !!(anim && (anim as any).entranceExit);
}

export function isHoverAnimation(anim: AnimationProps | undefined): anim is { hover: HoverAnimation } {
  return !!(anim && (anim as any).hover);
}