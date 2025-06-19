import React from 'react';
import type { ButtonProps } from './buttonTypes';

const Button: React.FC<ButtonProps> = ({ label, twClasses = [], action }) => {
  const handleClick = () => {
    if (action) {
      action();
    } else {
      console.log('No action provided');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`component-root ${twClasses.join(' ')}`}
    >
      {label}
    </button>
  );
};

export default Button;
