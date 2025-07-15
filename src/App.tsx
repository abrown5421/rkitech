import React from 'react';
import Button from './shared/components/button/Button';
import Modal from './features/modal/Modal';
import { useAppDispatch } from './app/hooks';
import Alert from './features/alert/Alert';
import { openDrawer } from './features/drawer/drawerSlice';
import Drawer from './features/drawer/Drawer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const handleClick = () => {
    dispatch(openDrawer({
      drawerOpen: true,
      drawertitle: 'Drawer Content',
      draweranchor: 'right',
      draweranimation: {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: true,
      },
      drawerchildren: (
        <div>
          <p>This can be anything you want inside the drawer.</p>
        </div>
      ),
    }));
  };

  return (
    <div className='w-screen h-screen z-30 relative'>
      <Button onClick={handleClick} color="success">open alert</Button>
      <Modal />
      <Alert />
      <Drawer />
    </div>
    
  );
};

export default App;
