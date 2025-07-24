import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeModal, preCloseModal } from './modalSlice';
import Icon from '../../shared/components/icon/Icon';
import Text from '../../shared/components/text/Text';
import ConfirmModalContent from './modals/ConfirmModalContent';
import EditProfileModalContent from './modals/EditProfileModalContent';

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

  const handleClose = () => dispatch(preCloseModal());
  if (!isVisible && !modal.modalOpen) return null;

  const renderModalContent = () => {
    switch (modal.modalType) {
      case 'confirm':
        return (
          <ConfirmModalContent
            message={modal.modalProps?.message}
            onConfirm={modal.modalProps?.onConfirm}
            onDeny={modal.modalProps?.onDeny}
          />
        );
      case 'editProfile':
        return (
          <EditProfileModalContent
            firstName={modal.modalProps?.firstName}
            lastName={modal.modalProps?.lastName}
            email={modal.modalProps?.email}
            onSave={modal.modalProps?.onSave}
            onCancel={modal.modalProps?.onCancel}
          />
        );
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
      bgColor="bg-gray-950/60"
      className={clsx('absolute top-0', isVisible ? 'z-40' : 'z-0')}
      animation={{
        entranceExit: {
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: modal.modalAnimation.isEntering,
        },
      }}
      onClick={handleClose}
    >
      <Container
        width="w-4/5 md:w-1/3"
        height="h-1/3"
        padding="md"
        flexDirection="col"
        bgColor="bg-white"
        className={clsx('rounded-2xl', isVisible ? 'z-50' : 'z-0')}
        animation={{
          entranceExit: {
            entranceAnimation: modal.modalAnimation.entranceAnimation,
            exitAnimation: modal.modalAnimation.exitAnimation,
            isEntering: modal.modalAnimation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="X" cursor="pointer" className="absolute top-4 right-4" onClick={handleClose} />
        <Text text={modal.modalTitle} size="2x" />
        {renderModalContent()}
      </Container>
    </Container>
  );
};

export default Modal;
