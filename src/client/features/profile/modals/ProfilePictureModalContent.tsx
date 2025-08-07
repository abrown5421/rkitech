
import React, { useState, useRef, useEffect } from 'react';
import type { DragEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import { deleteImageFromStorage } from '../../../../services/storage/deleteImage';
import { uploadProfileImage } from '../../../../services/storage/uploadImage';
import { updateDataInCollection } from '../../../../services/database/updateData';
import { preCloseModal } from '../../../../shared/features/modal/modalSlice';
import { openAlert } from '../../../../shared/features/alert/alertSlice';
import Container from '../../../../shared/components/container/Container';
import Icon from '../../../../shared/components/icon/Icon';
import Image from '../../../../shared/components/image/Image';
import Button from '../../../../shared/components/button/Button';
import Loader from '../../../../shared/components/loader/Loader';

const ProfilePictureModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfilePicUploading = loading && id === 'profilePic';
  const isProfilePicDeleting = loading && id === 'profilePicDeleting';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(authUser?.profileImage || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (authUser?.profileImage && !selectedFile) {
      setPreviewURL(authUser.profileImage);
    }
  }, [authUser?.profileImage, selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !authUser?.userId) return;
    dispatch(setLoading({ loading: true, id: 'profilePic' }));

    try {
        if (authUser.profileImage) {
        await deleteImageFromStorage(authUser.profileImage);
        }

        const imageUrl = await uploadProfileImage(selectedFile, authUser.userId, 'profileImages');
        await updateDataInCollection('Users', authUser.userId, { profileImage: imageUrl });

        dispatch(preCloseModal());
        dispatch(setNotLoading());
        dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Profile Picture was uploaded successfully!',
        alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
        }
        }));
    } catch (error) {
        console.error(error);
        dispatch(preCloseModal());
        dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Profile Picture upload failed.',
        alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
        }
        }));
        dispatch(setNotLoading());
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!authUser?.userId || !authUser.profileImage) return;
  
    dispatch(setLoading({ loading: true, id: 'profilePicDeleting' }));
  
    try {
      await deleteImageFromStorage(authUser.profileImage);
      await updateDataInCollection('Users', authUser.userId, { profileImage: '' });

      setPreviewURL(null);
      setSelectedFile(null);
  
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Profile Picture has been deleted.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    } catch (error) {
      console.error(error);
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Failed to delete Profile Picture.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    }
  };

  return (
    <Container TwClassName="flex-col h-full justify-between gap-4">
      <div
        className={`border-2 ${
          isDragging ? 'border-primary bg-blue-50' : 'border-dashed border-gray-400'
        } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-48 transition-colors`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {!previewURL ? (
          <Container TwClassName="flex flex-col items-center text-gray-500">
            <Icon color="text-gray-900" name="Camera" TwClassName="w-10 h-10 mb-2" />
            <span className="text-sm">Click or drag image to upload</span>
          </Container>
        ) : (
          <Image
            src={previewURL}
            alt="Preview"
            TwClassName="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Container TwClassName='flex-row justify-between gap-3'>
        {authUser?.profileImage && (
          <Button
            TwClassName="mt-2 p-2 bg-error rounded-xl text-white border-1 border-error hover:bg-transparent hover:text-error flex-1"
            onClick={handleDeleteProfilePicture}
          >
            {isProfilePicDeleting ? (
              <Loader variant="spinner" color="bg-white-500" />
            ) : (
              <>Delete Picture</>
            )}
          </Button>
        )}
      
      <Button 
        TwClassName='mt-2 p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary flex-1'
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        {isProfilePicUploading ? (
            <Loader variant="spinner" color="bg-white-500" />
        ) : (
            <>Upload</>
        )}
      </Button>
      </Container>
    </Container>
  );
};

export default ProfilePictureModalContent;