import React from 'react';
import clsx from 'clsx';
import type { TabProps } from './tabTypes';

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-300 ease-in-out',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      )}
    >
      {label}
    </button>
  );
};

export default Tab;
