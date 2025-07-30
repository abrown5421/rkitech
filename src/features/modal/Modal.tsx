import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeModal, preCloseModal } from './modalSlice';
import Icon from '../../shared/components/icon/Icon';
import Text from '../../shared/components/text/Text';
import ConfirmModalContent from './modals/ConfirmModalContent';
import ProfilePictureModalContent from './modals/ProfilePictureModalContent';
import ProfileBannerModalContent from './modals/ProfileBannerModalContent';

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
      case 'editProfilePic':
        return (
          <ProfilePictureModalContent />
        );
      case 'editProfileBanner':
        return (
          <ProfileBannerModalContent 
            yColors={modal.modalProps?.yColors}
            xColors={modal.modalProps?.xColors}
            auxImage={modal.modalProps?.auxImage}
            cellSize={modal.modalProps?.cellSize}
            variance={modal.modalProps?.variance}
          />
        )
      default:
        return null;
    }
  };

  return (
    <Container
      TwClassName={clsx("w-full h-full justify-center items-center bg-gray-950/60 absolute top-0", isVisible ? 'z-40' : 'z-0')}
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
        TwClassName={clsx('w-4/5 md:w-1/3 p-4 flex-col bg-white rounded-2xl', isVisible ? 'z-50' : 'z-0')}
        animation={{
          entranceExit: {
            entranceAnimation: modal.modalAnimation.entranceAnimation,
            exitAnimation: modal.modalAnimation.exitAnimation,
            isEntering: modal.modalAnimation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="X" cursor="pointer" TwClassName="absolute top-4 right-4" onClick={handleClose} />
        <Text text={modal.modalTitle} TwClassName="text-2x mb-4" />
        {renderModalContent()}
      </Container>
    </Container>
  );
};

export default Modal;