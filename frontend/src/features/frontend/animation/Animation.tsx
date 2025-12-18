import React from 'react';
import { Box, type Theme } from '@mui/material';
import type { AnimationProps } from './animationTypes';

const Animation: React.FC<AnimationProps> = ({
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
      className={`${className} ${animationClasses}`}
      sx={(theme: Theme) => {
        const base = { animationDelay: `${animationObject?.delay ?? 0}s` };
        if (!sx) return base;
        if (typeof sx === 'function') return { ...base, ...sx(theme) };
        return { ...base, ...sx };
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Animation;
