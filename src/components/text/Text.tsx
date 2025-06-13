import React from 'react';
import type { TextProps } from './textTypes'

const Text: React.FC<TextProps> = ({ text, twClasses = [] }) => {
  return (
    <div className={`component-root ${twClasses.join(' ')}`}>
      {text}
    </div>
  );
};

export default Text;
