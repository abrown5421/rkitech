
import clsx from 'clsx';
import type { AnimationObject } from '../types/animationTypes';

export function getAnimationClasses(animationObject?: AnimationObject) {
  if (!animationObject) return '';
  return clsx(
    'animate__animated',
    animationObject.isEntering
      ? animationObject.entranceAnimation
      : animationObject.exitAnimation
  );
}