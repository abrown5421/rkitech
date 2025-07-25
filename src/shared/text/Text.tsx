import React from 'react';
import type { TextProps } from './textTypes';

const Text: React.FC<TextProps> = ({ text, twClasses, ...rest }) => {
  const classString = Array.isArray(twClasses) ? twClasses.join(' ') : twClasses || '';

  return (
    <div className={`component-root ${classString}`} {...rest}>
      {text}
    </div>
  );
};

export default Text;
