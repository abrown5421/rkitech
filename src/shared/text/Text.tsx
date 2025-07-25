import React from 'react';
import type { TextProps } from './textTypes'

const Text: React.FC<TextProps> = ({ text, twClasses = [], ...rest }) => {
  return (
    <div className={`component-root ${twClasses.join(' ')}`} {...rest}>
      {text}
    </div>
  );
};

export default Text;
