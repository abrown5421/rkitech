import React from 'react';
import type { ButtonProps } from './buttonTypes';

const Button: React.FC<ButtonProps> = ({ label, twClasses = [], onClick, action }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (action) {
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
