import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeModal, preCloseModal } from './modalSlice';
import Icon from '../../shared/components/icon/Icon';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';

const Modal: React.FC = () => {
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (modal.modalOpen && modal.modalAnimation.isEntering) {
        setIsVisible(true);
    } else if (!modal.modalAnimation.isEntering) {
        timeout = setTimeout(() => {
        setIsVisible(false);
        dispatch(closeModal());
        }, 500);
    }

    return () => clearTimeout(timeout);
  }, [modal.modalOpen, modal.modalAnimation.isEntering, dispatch]);

  const handleClose = () => {
    dispatch(preCloseModal());
  };

  if (!isVisible && !modal.modalOpen) return null;

  const renderModalContent = () => {
    switch (modal.modalType) {
        case 'confirm':
        return (
            <Container flexDirection='col' height='h-full' justifyContent='between'>
                <Text size='md' text={modal.modalProps?.message || 'Are you sure?'} />
                <Container flexDirection='row' width='w-full' justifyContent='end' className='gap-2'>
                    <Button padding="sm" color="error" onClick={modal.modalProps?.onDeny}>Deny</Button>
                    <Button padding="sm" color="primary" onClick={modal.modalProps?.onConfirm}>Confirm</Button>
                </Container>
            </Container>
        );
        case 'custom':
        return modal.modalProps?.customComponent || null;
        default:
        return null;
    }
  };

  return (
    <Container
      width="w-full"
      height="h-full"
      justifyContent="center"
      alignItems="center"
      className={clsx('bg-gray-950/60 absolute top-0', isVisible ? 'z-40' : 'z-0')}
      animation={{
        entranceExit: {
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: modal.animation.isEntering,
        },
      }}
      onClick={handleClose}
    >
      <Container
        width="w-4/5 md:w-1/3"
        height="h-1/3"
        padding='md'
        flexDirection='col'
        className={clsx('bg-gray-50 rounded-2xl', isVisible ? 'z-50' : 'z-0')}
        animation={{
          entranceExit: {
            entranceAnimation: modal.animation.entranceAnimation,
            exitAnimation: modal.animation.exitAnimation,
            isEntering: modal.animation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon
            name="X"
            cursor="pointer"
            className="absolute top-4 right-4"
            onClick={handleClose}
        />
        <Text text={modal.title} size='2x'/>
        {renderModalContent()}
      </Container>
    </Container>
  );
};

export default Modal;
