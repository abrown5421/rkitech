import React from 'react';
import Button from './shared/components/button/Button';
import { openModal } from './features/modal/modalSlice';
import Modal from './features/modal/Modal';
import { useAppDispatch } from './app/hooks';
import Text from './shared/components/text/Text';
import Container from './shared/components/container/Container';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalContent = () => {
    return (
      <div>
        <Text size='md' text='Are you sure you want to proceed?' />
        <Container flexDirection='row'>
          <Button color="primary">confirm</Button>
          <Button color="error">deny</Button>
        </Container>
      </div>
    )
  }
  const handleClick = () => {
    dispatch(openModal({
      title: 'Confirm Action',
      modalType: 'confirm',
      modalProps: {
        message: 'Are you sure you want to proceed?',
        onConfirm: () => console.log('Confirmed'),
        onDeny: () => console.log('Denied'),
      },
      entranceAnimation: 'animate__backInUp',
      exitAnimation: 'animate__backOutDown',
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
