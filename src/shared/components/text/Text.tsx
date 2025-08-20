

import React, { useState } from 'react';
import clsx from 'clsx';
import type { TextProps } from './textTypes';
import { getAnimationClasses } from '../../../client/utils/useAnimation';

const Text: React.FC<TextProps> = ({
  text,
  animation,
  TwClassName = '',
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const classes = clsx(
    animationClasses,
    classString
  );


  return (
    <div 
      className={classes}
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </div>
  );
};

export default Text;
