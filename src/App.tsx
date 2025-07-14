import React from 'react';
import Button from './shared/components/button/Button';
import Modal from './features/modal/Modal';
import { useAppDispatch } from './app/hooks';
import Alert from './features/alert/Alert';
import { openAlert } from './features/alert/alertSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const handleClick = () => {
    dispatch(openAlert({
      open: true,
      severity: 'success',
      message: 'testing the alert',
    }));
  }

  return (
    <div className='w-screen h-screen z-30 relative'>
      <Button onClick={handleClick} color="success">open alert</Button>
      <Modal />
      <Alert />
    </div>
    
  );
};

export default App;
