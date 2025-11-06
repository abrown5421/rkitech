import React from 'react';
import { Box } from '@mui/material';
import type { AnimBoxProps } from './animBoxTypes';

const AnimBox: React.FC<AnimBoxProps> = ({
  children,
  className = '',
  animationObject,
  sx,
  onClick,
  ...rest
}) => {
  const animationClasses = animationObject
    ? `animate__animated ${
        animationObject.isEntering
          ? animationObject.entranceAnimation
          : animationObject.exitAnimation
      }`
    : '';

  return (
    <Box
      className={`component-root ${className} ${animationClasses}`}
      sx={{
        animationDelay: `${animationObject?.delay ?? 0}s`,
        cursor: onClick ? 'pointer' : 'default',
        ...sx, 
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default AnimBox;
