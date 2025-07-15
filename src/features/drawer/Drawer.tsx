import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeDrawer, preCloseDrawer } from './drawerSlice';
import Icon from '../../shared/components/icon/Icon';
import clsx from 'clsx';
import Text from '../../shared/components/text/Text';

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((state) => state.drawer);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (drawer.drawerOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [drawer.drawerOpen]);

  const handleClose = () => {
    dispatch(preCloseDrawer());
    setTimeout(() => dispatch(closeDrawer()), 300);
  };

  if (!isVisible) return null;

  const positionClasses = {
    right: 'top-0 right-0 h-full',
    left: 'top-0 left-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  return (
    <Container
      width="w-full"
      height="h-full"
      bgColor='bg-gray-950/60'
      className={clsx(
        'fixed top-0 left-0 flex',
        drawer.draweranchor === 'right' || drawer.draweranchor === 'left'
          ? 'justify-start'
          : 'items-start',
        'z-40'
      )}
      animation={{
        entranceExit: {
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: drawer.draweranimation.isEntering,
        },
      }}
      onClick={handleClose} 
    >
      <Container
        padding="md"
        bgColor='bg-white'
        className={clsx(
          'shadow-xl absolute',
          positionClasses[drawer.draweranchor ?? 'right']
        )}
        animation={{
          entranceExit: {
            entranceAnimation: drawer.draweranimation.entranceAnimation,
            exitAnimation: drawer.draweranimation.exitAnimation,
            isEntering: drawer.draweranimation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon
          name="X"
          cursor="pointer"
          className="absolute top-4 right-4"
          onClick={handleClose}
        />
            <div className='flex flex-col'>
                {drawer.drawertitle && <Text text={drawer.drawertitle} size='xl' bold={true} />}
                {drawer.drawerchildren}
            </div>
      </Container>
    </Container>
  );
};

export default Drawer;
