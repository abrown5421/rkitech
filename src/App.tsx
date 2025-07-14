import React from 'react';
import Button from './shared/components/button/Button';
import { openModal } from './features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import Modal from './features/modal/Modal';

const App: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openModal({
      title: 'Confirm Action',
      content: <div>Are you sure you want to proceed?</div>,
    }));
  }

  return (
    <div className='w-screen h-screen z-30 relative'>
      <Button onClick={handleClick} color="success">open modal</Button>
      <Modal />
    </div>
    
  );
};

export default App;
