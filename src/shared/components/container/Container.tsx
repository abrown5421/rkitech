import React from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';

const Container: React.FC<ContainerProps> = ({ children, animationObject, className }) => {
  const animationClasses = animationObject
    ? clsx(
        'animate__animated',
        animationObject.isEntering
          ? animationObject.entranceAnimation
          : animationObject.exitAnimation
      )
    : '';

  return (
    <div className={clsx(animationClasses, className)}>
      {children}
    </div>
  );
};

export default Container;
