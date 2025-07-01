import React from 'react';
import type { DrawerProps } from './drawerTypes';
import Button from '../button/Button';
import Icon from '../Icon/Icon';
const Drawer: React.FC<DrawerProps> = ({
  width = '300px',
  height = '100%',
  orientation = 'left',
  open,
  onClose,
  children,
  twClasses =[], 
  ...rest
}) => {
  const isHorizontal = orientation === 'left' || orientation === 'right';

  const getDrawerPosition = () => {
    switch (orientation) {
      case 'left':
        return open ? 'translate-x-0' : '-translate-x-full';
      case 'right':
        return open ? 'translate-x-0' : 'translate-x-full';
      case 'top':
        return open ? 'translate-y-0' : '-translate-y-full';
      case 'bottom':
        return open ? 'translate-y-0' : 'translate-y-full';
      default:
        return '';
    }
  };
  
  const positionClasses =
    orientation === 'left'
      ? 'top-0 bottom-0 left-0'
      : orientation === 'right'
      ? 'top-0 bottom-0 right-0'
      : orientation === 'top'
      ? 'left-0 right-0 top-0'
      : 'left-0 right-0 bottom-0';

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-gray-900 opacity-25 z-50 transition-opacity"
        />
      )}

      <div
        className={`fixed z-50 bg-white shadow-lg transition-transform duration-300 p-2 ease-in-out ${twClasses.join(' ')} ${positionClasses} ${getDrawerPosition()}`} 
        {...rest}
        style={{
          width: isHorizontal ? width : '100%',
          height: isHorizontal ? '100%' : height,
          maxWidth: isHorizontal ? '100vw' : undefined,
          maxHeight: isHorizontal ? undefined : '100vh',
        }}
      >
        <Button
            label={<Icon name="X" />}
            twClasses={['absolute top-2 right-2']}
            action={onClose}
        />
        {children}
      </div>
    </>
  );
};

export default Drawer;