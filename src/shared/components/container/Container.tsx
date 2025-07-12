import React from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';

const paddingMap = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2x': 'p-10',
  '3x': 'p-12',
  '4x': 'p-14',
  '5x': 'p-16',
  '6x': 'p-18'
};

const marginMap = {
  none: '',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2x': 'm-10',
  '3x': 'm-12',
  '4x': 'm-14',
  '5x': 'm-16',
  '6x': 'm-18'
};

const borderMap = {
  none: '',
  default: 'border border-primary',
  thick: 'border-2 border-primary',
  dashed: 'border-2 border-dashed border-primary',
};

const flexDirectionMap = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

const justifyContentMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignItemsMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

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
