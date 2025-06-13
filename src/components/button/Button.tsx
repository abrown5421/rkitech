import React from 'react';
import type { ButtonProps } from './buttonTypes';

const Button: React.FC<ButtonProps> = ({ label, twClasses = [] }) => {
  const handleClick = () => {
    console.log('TODO: create a way to manage actions')
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
