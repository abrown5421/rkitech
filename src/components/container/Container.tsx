import React from 'react';
import type { ContainerProps } from './containerTypes';

const Container: React.FC<ContainerProps> = ({ children, twClasses = [], animationObject }) => {
    const animationClasses = animationObject
        ? `animate__animated ${animationObject.isEntering ? animationObject.entranceAnimation : animationObject.exitAnimation}`
        : '';

    return (
        <div className={`component-root ${animationClasses} ${twClasses.join(' ')}`}>
            {children}
        </div>
    );
};

export default Container;
