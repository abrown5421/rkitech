import React from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';

const App: React.FC = () => {

  return (
    <div className='w-screen h-screen z-30 relative'>
      <Navbar />
      <Modal />
      <Alert />
      <Drawer />
    </div>
    
  );
};

export default App;
