import React from 'react';
import type { PodProps } from './podTypes';
import { parseColor } from '../shared/utils/parseColor';

const Pod: React.FC<PodProps> = ({
  children,
  className = '',
  animationObject,
  style,
  onClick,
  textColor,
  bgColor,
  border,
  textStyle,
  m, mt, mr, mb, ml, mx, my,
  p, pt, pr, pb, pl, px, py,
}) => {
  const animationClasses = animationObject
    ? `animate__animated ${animationObject.isEntering ? animationObject.entranceAnimation : animationObject.exitAnimation}`
    : '';

  const colorClasses = [
    textColor ? parseColor(textColor, 'text') : '',
    bgColor ? parseColor(bgColor, 'bg') : '',
    border?.color ? parseColor(border.color, 'border') : '',
    border?.width ? `border-${border.width}` : '',
  ].filter(Boolean).join(' ');

  const spacingClasses = [
    m ? `m-${m}` : '',
    mt ? `mt-${mt}` : '',
    mr ? `mr-${mr}` : '',
    mb ? `mb-${mb}` : '',
    ml ? `ml-${ml}` : '',
    mx ? `mx-${mx}` : '',
    my ? `my-${my}` : '',
    p ? `p-${p}` : '',
    pt ? `pt-${pt}` : '',
    pr ? `pr-${pr}` : '',
    pb ? `pb-${pb}` : '',
    pl ? `pl-${pl}` : '',
    px ? `px-${px}` : '',
    py ? `py-${py}` : '',
  ].filter(Boolean).join(' ');

  const textStyleClasses = [
    textStyle?.bold ? 'font-bold' : '',
    textStyle?.italic ? 'italic' : '',
    textStyle?.underline ? 'underline' : '',
  ].filter(Boolean).join(' ');

  const inlineBorderStyle = border?.style ? { borderStyle: border.style } : {};

  return (
    <div
      className={`component-root ${className} ${animationClasses} ${colorClasses} ${spacingClasses} ${textStyleClasses}`}
      style={{
        animationDelay: `${animationObject?.delay ?? 0}s`,
        ...inlineBorderStyle,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Pod;
