import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeModal } from './modalSlice';
import Icon from '../../shared/components/icon/Icon';

const Modal: React.FC = () => {
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (modal.isOpen) setIsVisible(true);
  }, [modal.isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(closeModal());
    }, 500); 
  };

  if (!modal.isOpen && !isVisible) return null;

  return (
    <Container
      width="w-full"
      height="h-full"
      justifyContent="center"
      alignItems="center"
      className={clsx('bg-gray-950/60 absolute top-0', 'z-40')}
      animation={{
        entranceExit: {
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: modal.isOpen,
        },
      }}
      onClick={handleClose}
    >
      <Container
        width="w-1/3"
        height="h-1/2"
        className={clsx('bg-gray-50 rounded-2xl z-50')}
        animation={{
          entranceExit: {
            entranceAnimation: modal.entranceAnimation,
            exitAnimation: modal.exitAnimation,
            isEntering: modal.isOpen,
          },
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <button  >
            <Icon name="X" cursor='pointer' className="absolute top-4 right-4" onClick={handleClose} />
        </button>
        <div className="p-4 text-lg font-semibold">{modal.title}</div>
        <div className="px-4">{modal.content}</div>
      </Container>
    </Container>
  );
};

export default Modal;
