import React, { useEffect } from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pageShell/PageShell';
import { useAppSelector } from './app/hooks';

const App: React.FC = () => {
  const activePage = useAppSelector((state) => state.pageShell);

  useEffect(()=>{console.log(activePage)}, [activePage])
  return (
    <div className='w-screen h-screen z-30 relative bg-black'>
      <Navbar />
      <PageShell 
        pageShellRenderMethod = 'dynamic'
        pageShellBackgroundColor = 'bg-white'
        pageShellAnimation={{
            entranceAnimation: 'animate__fadeIn',
            exitAnimation: 'animate__fadeOut',
            isEntering: true,
        }}
      />
      <Modal />
      <Alert />
      <Drawer />
    </div>
    
  );
};

export default App;
