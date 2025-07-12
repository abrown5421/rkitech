import clsx from 'clsx';
import type { AnimationProps, EntranceExitAnimation, HoverAnimation } from '../types/animationTypes';

export function isEntranceExitAnimation(anim: AnimationProps | undefined): anim is { entranceExit: EntranceExitAnimation } {
  return !!(anim && (anim as any).entranceExit);
}

export function isHoverAnimation(anim: AnimationProps | undefined): anim is { hover: HoverAnimation } {
  return !!(anim && (anim as any).hover);
}

export function getAnimationClasses(animation: AnimationProps | undefined, isHovered: boolean): string {
  if (!animation) return 'animate__animated';

  if (isEntranceExitAnimation(animation)) {
    return clsx(
      'animate__animated',
      animation.entranceExit.isEntering
        ? animation.entranceExit.entranceAnimation
        : animation.entranceExit.exitAnimation
    );
  }

  if (isHoverAnimation(animation) && isHovered) {
    return clsx('animate__animated', animation.hover.hoverAnimation);
  }

  return 'animate__animated';
}
