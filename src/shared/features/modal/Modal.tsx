import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { closeModal, preCloseModal } from './modalSlice';
import ProfilePictureModalContent from '../../../client/features/profile/modals/ProfilePictureModalContent';
import ProfileBannerModalContent from '../../../client/features/profile/modals/ProfileBannerModalContent';
import DeleteAccountModalContent from '../../../client/features/profile/modals/DeleteAccountModalContent';
import DisableAccountModalContent from '../../../client/features/profile/modals/DisableAccountModalContent';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Container from '../../components/container/Container';
import Icon from '../../components/icon/Icon';
import Text from '../../components/text/Text';
import NewBlogPost from '../../../admin/features/blog/modals/NewBlogPost';
import GalleryImageModal from '../../../client/features/gallery/modals/GalleryImageModal';
import ImageUploadModal from '../../../admin/features/gallery/modals/ImageUploadModal';
import NewImageModal from '../../../admin/features/gallery/modals/NewImageModal';

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
      case 'newImageModal': 
        return (
          <NewImageModal />
        )
      case 'imageUploadModal':
        return (
          <ImageUploadModal
            imageUrl={modal.modalProps?.imageUrl}
            imageName={modal.modalProps?.imageName}
            imageDescription={modal.modalProps?.imageDescription}
            imageUpload={modal.modalProps?.imageUpload}
            imagePostId={modal.modalProps?.galleryPostID} 
          />
        )
      case 'newBlogPost':
        return (
          <NewBlogPost />
        );
      case 'galleryImageModal': 
        return (
          <GalleryImageModal 
            imageDecription={modal.modalProps?.imageDecription}
            imageUrl={modal.modalProps?.imageUrl}
          />
        )
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
      case 'deleteAccount':
        return <DeleteAccountModalContent />;
      case 'disableAccount':
        return <DisableAccountModalContent />;
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
        TwClassName={clsx('p-4 flex-col bg-white rounded-2xl', isVisible ? 'z-50' : 'z-0')}
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
        {renderModalContent()}
      </Container>
    </Container>
  );
};

export default Modal;