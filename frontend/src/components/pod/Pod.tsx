import React from 'react';
import type { PodProps } from './podTypes';

const Pod: React.FC<PodProps> = ({
  children,
  className = '',
  animationObject,
  style,
  onClick, 
}) => {
  const animationClasses = animationObject
    ? `animate__animated ${animationObject.isEntering ? animationObject.entranceAnimation : animationObject.exitAnimation}`
    : '';

  return (
    <div
      className={`component-root ${className} ${animationClasses}`}
      style={{
        animationDelay: `${animationObject?.delay ?? 0}s`,
        ...style, 
      }}
      onClick={onClick} 
    >
      {children}
    </div>
  );
};

export default Pod;
