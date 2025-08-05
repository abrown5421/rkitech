import clsx from 'clsx';
import type { AnimationProps, EntranceExitAnimation, HoverAnimation } from '../../shared/types/animationTypes';

export function isEntranceExitAnimation(anim: AnimationProps | undefined): anim is { entranceExit: EntranceExitAnimation } {
  return !!(anim && 'entranceExit' in anim && anim.entranceExit);
}

export function isHoverAnimation(anim: AnimationProps | undefined): anim is { hover: HoverAnimation } {
  return !!(anim && 'hover' in anim && anim.hover);
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
    const { hoverAnimation, infinite, repeat } = animation.hover;

    const repeatClass = infinite
      ? 'animate__infinite'
      : typeof repeat === 'number'
        ? `animate__repeat-${repeat}`
        : undefined;

    return clsx('animate__animated', hoverAnimation, repeatClass);
  }

  return 'animate__animated';
}