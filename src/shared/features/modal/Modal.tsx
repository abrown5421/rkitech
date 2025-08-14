import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { closeModal, preCloseModal } from './modalSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Container from '../../components/container/Container';
import Icon from '../../components/icon/Icon';
import Text from '../../components/text/Text';
import ConfirmOrDenyModal from './sharedModals/ConfirmOrDenyModal';
import TrianglifyModal from './sharedModals/TrianglifyModal';
import PictureUploadModal from './sharedModals/PictureUploadModal';

const MODAL_COMPONENTS: Record<string, React.FC<any>> = {
  confirmOrDeny: ConfirmOrDenyModal,
  trianglify: TrianglifyModal,
  pictureUpload: PictureUploadModal, 
};

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

  const SpecificModal = MODAL_COMPONENTS[modal.modalType];

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
        TwClassName={clsx('p-4 min-w-150 max-w-1/3 flex-col bg-white rounded-2xl', isVisible ? 'z-50' : 'z-0')}
        animation={{
          entranceExit: {
            entranceAnimation: modal.modalAnimation.entranceAnimation,
            exitAnimation: modal.modalAnimation.exitAnimation,
            isEntering: modal.modalAnimation.isEntering,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon color="text-gray-900" name="X" TwClassName="absolute top-4 right-4" onClick={handleClose} />
        <Text text={modal.modalTitle} TwClassName="text-black font-primary text-xl mb-5" />
        <Text text={modal.modalMessage} TwClassName="text-black" />
        {SpecificModal && <SpecificModal />}
      </Container>
    </Container>
  );
};

export default Modal;