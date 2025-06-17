import React from 'react';
import type { ImageProps } from './imageTypes';

const Image: React.FC<ImageProps & { twClasses?: string[] }> = ({
  src,
  alt,
  width,
  height,
  twClasses = [],
}) => {
  return (
    <img
      className={twClasses.join(' ')}
      src={src}
      alt={alt}
      style={{
        width: typeof width === 'string' ? width : width ? `${width}px` : undefined,
        height: typeof height === 'string' ? height : height ? `${height}px` : undefined,
      }}
    />
  );
};

export default Image;
