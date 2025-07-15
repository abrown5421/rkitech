import React from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pageShell/PageShell';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {

  return (
    <div className='w-screen h-screen z-30 relative bg-black'>
      <Navbar />
      <Routes>
        <Route path="Login" element={
          <PageShell 
            pageShellRenderMethod = 'static'
            pageShellBackgroundColor = 'bg-transparent'
            pageShellAnimation={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: true,
            }}
          />
        } />
        <Route path="/" element={
          <PageShell 
            pageShellRenderMethod = 'static'
            pageShellBackgroundColor = 'bg-white'
            pageShellAnimation={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: true,
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
