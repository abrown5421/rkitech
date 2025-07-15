import React from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pageShell/PageShell';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';

const App: React.FC = () => {
  const activePage = useAppSelector((state) => state.pageShell);

  return (
    <div className='w-screen h-screen z-30 relative bg-black'>
      <Navbar />
      <Routes>
        <Route path='/' element={
          <PageShell 
            activePageShellBgColor='bg-white' 
            activePageShellAnimation = {{
              entranceAnimation: 'animate__fadeIn',
              exitAnimation: 'animate__fadeOut',
              isEntering: activePage.activePageShellIn,
            }}
          />
        } />
        <Route path='/Login' element={
          <PageShell 
            activePageShellBgColor='bg-transparent'
            activePageShellAnimation = {{
              entranceAnimation: 'animate__fadeInUpBig',
              exitAnimation: 'animate__fadeOutDownBig',
              isEntering: activePage.activePageShellIn,
            }}
          />
        } />
      </Routes>
      <Modal />
      <Alert />
      <Drawer />
    </div>
    
  );
};

export default App;
