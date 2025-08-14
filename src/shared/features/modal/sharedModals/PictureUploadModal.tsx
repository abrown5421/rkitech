import React, { useRef, useState } from 'react';
import { fireModalAction, preCloseModal } from '../modalSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Container from '../../../components/container/Container';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import Icon from '../../../components/icon/Icon';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import { uploadProfileImage } from '../../../../services/storage/uploadImage';
import Image from '../../../components/image/Image';
import Loader from '../../../components/loader/Loader';
import { deleteImageFromStorage } from '../../../../services/storage/deleteImage';

const PictureUploadModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalProps = useAppSelector(state => state.modal.modalProps);
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const savingPfp = loading && id === 'savingPfp';
  const actionId = modalProps?.actionId || 'pictureUpload';
  const existingImage = modalProps?.existingImage || '';

  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>(existingImage);
  const [previewImage, setPreviewImage] = useState<string>(existingImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setSelectedFile(file);
    setActiveTab("upload");
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    setPreviewImage(url);
    setActiveTab("url");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    dispatch(setLoading({ loading: true, id: 'savingPfp' }));
    if (!authUser?.userId) {
      alert('User not authenticated.');
      return;
    }

    let resultUrl = '';

    // if (authUser.profileImage) {
    //     await deleteImageFromStorage(authUser.profileImage)
    // }

    if (activeTab === "url") {
      if (!urlInput.trim()) {
        alert('Please enter a valid URL.');
        return;
      }
      resultUrl = urlInput.trim();
    } else if (activeTab === "upload") {
      if (!selectedFile) {
        alert('No image uploaded.');
        return;
      }
      try {
        resultUrl = await uploadProfileImage(selectedFile, authUser.userId, 'profileImages');
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    } else {
      alert('Please select an image or enter a URL.');
      return;
    }

    if (resultUrl === existingImage) {
      dispatch(setNotLoading());
      dispatch(preCloseModal());
      return;
    }

    dispatch(fireModalAction({
      modalActionFire: true,
      modalActionId: actionId,
      imageUrl: resultUrl,
    }));

    dispatch(setNotLoading());
    dispatch(preCloseModal());
  };

  const handleCancel = () => {
    dispatch(fireModalAction({
      modalActionFire: false,
      modalActionId: '',
    }));
    dispatch(setNotLoading());
    dispatch(preCloseModal());
  };

  return (
    <Container TwClassName="flex flex-col gap-4 min-w-150">
      <Container TwClassName="flex gap-2">
        <Button
          TwClassName={`py-1 px-3 rounded-full text-sm ${
            activeTab === "url"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("url")}
        >
          Enter URL
        </Button>
        <Button
          TwClassName={`py-1 px-3 rounded-full text-sm ${
            activeTab === "upload"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </Button>
      </Container>

      {activeTab === "url" && (
        <Container TwClassName="flex-col gap-4">
          <Input
            type="text"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            label="Image URL"
            placeholder="https://example.com/image.jpg"
          />
        </Container>
      )}

      {activeTab === "upload" && (
        <div
          className={`border-2 ${
            isDragging
              ? "border-primary bg-blue-50"
              : "border-dashed border-gray-400"
          } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-48 transition-colors`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          {!previewImage || activeTab !== "upload" ? (
            <Container TwClassName="flex flex-col items-center text-gray-500">
              <Icon color="text-gray-900" name="Camera" TwClassName="w-10 h-10 mb-2" />
              <span className="text-sm">Click or drag image to upload</span>
            </Container>
          ) : (
            <Image
              src={previewImage}
              alt="Preview"
              TwClassName="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
            }}
          />
        </div>
      )}
      
      {previewImage && (
        <Container TwClassName="flex-col gap-2">
          <Container TwClassName="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              {existingImage && previewImage === existingImage ? 'Current Image:' : 'Preview:'}
            </span>
            {previewImage && (
              <Button
                onClick={() => {
                  setPreviewImage('');
                  setUrlInput('');
                  setSelectedFile(null);
                }}
                TwClassName="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Remove
              </Button>
            )}
          </Container>
          <Container TwClassName="border rounded-lg overflow-hidden">
            <Image
              src={previewImage}
              alt="Preview"
              TwClassName="w-full h-75 object-cover"
            />
          </Container>
        </Container>
      )}
      
      <Container TwClassName="flex-row gap-2 justify-end mt-4">
        <Button
          onClick={handleCancel}
          TwClassName="min-w-[100px] py-1 px-2 bg-gray-300 rounded-xl text-white border-1 border-gray-300 hover:bg-transparent hover:text-gray-300 flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          TwClassName="min-w-[100px] py-1 px-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary flex-1"
        >
          {savingPfp ? <Loader variant='spinner' color='text-gray-50'/> : <>Save</>}
        </Button>
      </Container>
    </Container>
  );
};

export default PictureUploadModal;