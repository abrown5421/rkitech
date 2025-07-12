import React from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';

const paddingMap = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const marginMap = {
  none: '',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
};

const borderMap = {
  none: '',
  default: 'border border-primary',
  thick: 'border-2 border-primary',
  dashed: 'border-2 border-dashed border-primary',
};

const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'md',
  margin = 'none',
  border = 'none',
  rounded = false,
  shadow = false,
  animationObject,
  className,
}) => {
  const animationClasses = animationObject
    ? clsx(
        'animate__animated',
        animationObject.isEntering
          ? animationObject.entranceAnimation
          : animationObject.exitAnimation
      )
    : '';

  const classes = clsx(
    paddingMap[padding],
    marginMap[margin],
    borderMap[border],
    rounded && 'rounded-xl',
    shadow && 'shadow-lg',
    animationClasses,
    className
  );

  return <div className={classes}>{children}</div>;
};


export default Container;
