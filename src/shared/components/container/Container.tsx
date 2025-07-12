import React from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';
import { alignItemsMap, flexDirectionMap, justifyContentMap } from '../../constants/flexConstants';
import { marginMap, paddingMap } from '../../constants/spacingConstants';
import { borderMap } from '../../constants/borderConstants';

const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'none',
  margin = 'none',
  border = 'none',
  rounded = false,
  shadow = false,
  animationObject,
  className,
  flexDirection = 'row',
  justifyContent = 'start',
  alignItems = 'stretch',
  width = 'auto',
  height = 'auto',
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
    'flex',
    flexDirectionMap[flexDirection],
    justifyContentMap[justifyContent],
    alignItemsMap[alignItems],
    paddingMap[padding],
    marginMap[margin],
    borderMap[border],
    rounded && 'rounded-xl',
    shadow && 'shadow-lg',
    width,
    height,
    animationClasses,
    className
  );

  return <div className={classes}>{children}</div>;
};


export default Container;
