import React, { useEffect, useState, type JSX } from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { closeDrawer, preCloseDrawer } from './drawerSlice';
import clsx from 'clsx';
import Icon from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import LoggedInDrawerContent from '../../../client/features/navbar/drawers/LoggedInDrawerContent';
import LoggedOutDrawerContent from '../../../client/features/navbar/drawers/LoggedOutDrawerContent';

const Drawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((state) => state.drawer);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(drawer.drawerOpen);
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

  const drawerContentRegistry: Record<string, JSX.Element> = {
    loggedInMenu: <LoggedInDrawerContent />,
    loggedOutMenu: <LoggedOutDrawerContent />
  };

  return (
    <Container
      TwClassName={clsx(
        'fixed top-0 left-0 flex w-full h-full bg-gray-950/60',
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
        TwClassName={clsx('p-4 bg-gray-50 min-w-100 shadow-xl absolute', positionClasses[drawer.draweranchor ?? 'right'])}
        animation={{
          entranceExit: {
            entranceAnimation: drawer.draweranimation.entranceAnimation,
            exitAnimation: drawer.draweranimation.exitAnimation,
            isEntering: drawer.draweranimation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon color="text-gray-900" name="X" cursor="pointer" TwClassName="absolute top-4 right-4" onClick={handleClose} />
        <div className="flex flex-col w-full">
          {drawer.drawertitle && <Text text={drawer.drawertitle} TwClassName="text-xl font-bold" />}
          {drawer.drawerContentType && drawerContentRegistry[drawer.drawerContentType]}
        </div>
      </Container>
    </Container>
  );
};

export default Drawer;

