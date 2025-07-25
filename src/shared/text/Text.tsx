import React, { useRef } from 'react';
import { getAnimationClasses, getAnimationStyles } from '../constants/animationConstants';
import type { TextProps } from './textTypes';

const Text: React.FC<TextProps> = ({ text, twClasses, animation, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);

  const classString = Array.isArray(twClasses) ? twClasses.join(' ') : twClasses || '';
  const animationClasses = getAnimationClasses(animation);
  const animationStyles = getAnimationStyles(animation);

  return (
    <div
      ref={ref}
      className={`component-root ${classString} ${animationClasses}`}
      style={animationStyles}
      {...rest}
    >
      {text}
    </div>
  );
};


export default Text;