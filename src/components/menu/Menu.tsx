import React from 'react';
import type { MenuProps } from './menuTypes';
import { useAppSelector } from '../../store/hooks';
import { useClientNavigationHook } from '../../client/hooks/useClientNavigationHook';

const Menu: React.FC<MenuProps> = ({
  twClasses = []
}) => {

  return (
    <div>
      menu
    </div>
  );
};

export default Menu;
