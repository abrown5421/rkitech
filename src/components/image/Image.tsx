import React from 'react';
import type { ImageComponentProps } from './imageTypes';

const Image: React.FC<ImageComponentProps> = ({ props, twClasses = [] }) => {
  return (
    <img
        className={twClasses.join(' ')}
        src={props.src}
        alt={props.alt}
        style={{
            width: typeof props.width === 'string' ? props.width : props.width ? `${props.width}px` : undefined,
            height: typeof props.height === 'string' ? props.height : props.height ? `${props.height}px` : undefined,
        }}
    />
  );
};

export default Image;