import React, { useEffect, useRef, useState } from "react";
import Container from "../../../../shared/components/container/Container";
import Button from "../../../../shared/components/button/Button";
import Input from "../../../../shared/components/input/Input";
import Icon from "../../../../shared/components/icon/Icon";
import TrianglifyBanner from "../../../../shared/components/trianglifyBanner/TrianglifyBanner";
import type { ProfileBannerModalContentProps } from "../../../../shared/features/modal/modalTypes";
import { updateDataInCollection } from "../../../../services/database/updateData";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { preCloseModal } from "../../../../shared/features/modal/modalSlice";
import { setLoading, setNotLoading } from "../../../../app/globalSlices/loading/loadingSlice";
import { openAlert } from "../../../../shared/features/alert/alertSlice";
import Loader from "../../../../shared/components/loader/Loader";
import { deleteImageFromStorage } from "../../../../services/storage/deleteImage";
import { uploadProfileImage } from "../../../../services/storage/uploadImage";

const ProfileBannerModalContent: React.FC<ProfileBannerModalContentProps> = ({
  yColors = ["#ffffff", "#cccccc"],
  xColors = ["#000000", "#333333"],
  auxImage = null,
  cellSize = 50,
  variance = 0.5,
}) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfileBanUploading = loading && id === 'profileBan';
  const isProfileBanDeleting = loading && id === 'profileBanDel';
  const [activeTab, setActiveTab] = useState<"trianglify" | "image">(
    auxImage ? "image" : "trianglify"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    yColors,
    xColors,
    auxImage,
    cellSize,
    variance,
  });
  const [originalImage, setOriginalImage] = useState<string | null>(
    authUser?.trianglifyObject?.auxImage || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (authUser?.trianglifyObject?.auxImage) {
      setFormData((prev) => ({
        ...prev,
        auxImage: authUser.trianglifyObject.auxImage ?? null,
      }));
      setActiveTab("image");
    }
  }, [authUser?.trianglifyObject?.auxImage]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File) => {
    const url = URL.createObjectURL(file);
    handleChange("auxImage", url);
    setSelectedFile(file);
    setActiveTab("image");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleBannerUploadAndSave = async () => {
    dispatch(setLoading({ loading: true, id: 'profileBan' }));
    if (!authUser?.userId) {
      console.error("User not authenticated.");
      return;
    }

    try {
      if (activeTab === 'image' && selectedFile) {
        if (authUser.trianglifyObject?.auxImage && authUser.trianglifyObject.auxImage.startsWith('https://')) {
          await deleteImageFromStorage(authUser.trianglifyObject.auxImage);
        }

        const imageUrl = await uploadProfileImage(selectedFile, authUser.userId, 'profileBannerImages');
        formData.auxImage = imageUrl; 
      }

      await updateDataInCollection("Users", authUser.userId, {
        trianglifyObject: {
          ...formData,
          width: 'w-full',
          height: 250,
        },
      });
      dispatch(preCloseModal());
      dispatch(openAlert({
      alertOpen: true,
      alertSeverity: 'success',
      alertMessage: 'Profile banner was uploaded successfully!',
      alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
      }
      }));
      dispatch(setNotLoading());
    } catch (error) {
      console.error("Failed to save banner data:", error);
      dispatch(preCloseModal());
      dispatch(openAlert({
      alertOpen: true,
      alertSeverity: 'error',
      alertMessage: 'Profile banner upload failed.',
      alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
      }
      }));
      dispatch(setNotLoading());
    }
  }

  const handleDeleteBannerImage = async () => {
    if (!authUser?.userId || !formData.auxImage) return;

    dispatch(setLoading({ loading: true, id: 'profileBanDel' }));

    try {
      if (formData.auxImage.startsWith("https://")) {
        await deleteImageFromStorage(formData.auxImage);
      }

      await updateDataInCollection("Users", authUser.userId, {
        trianglifyObject: {
          ...formData,
          auxImage: '',
          width: 'w-full',
          height: 250,
        },
      });

      setFormData((prev) => ({ ...prev, auxImage: null }));
      setSelectedFile(null);
      setOriginalImage(null);

      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Banner image deleted.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    } catch (error) {
      console.error("Failed to delete banner image:", error);
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Failed to delete banner image.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    }
  };

  return (
    <Container TwClassName="flex flex-col gap-4 min-w-150">
      <div className="flex gap-2">
        <Button
          TwClassName={`py-1 px-3 rounded-full text-sm ${
            activeTab === "trianglify"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("trianglify");
            handleChange("auxImage", null);
          }}
        >
          Trianglify
        </Button>
        <Button
          TwClassName={`py-1 px-3 rounded-full text-sm ${
            activeTab === "image"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("image")}
        >
          Upload Image
        </Button>
      </div>

      <TrianglifyBanner
        width="w-full"
        height={175}
        yColors={formData.yColors}
        xColors={formData.xColors}
        variance={formData.variance}
        cellSize={formData.cellSize}
        auxImage={activeTab === "image" ? formData.auxImage ?? undefined : undefined}
      />

      {activeTab === "trianglify" && (
        <>
          <Container TwClassName="gap-2">
            <Input
              type="color"
              value={formData.yColors[0]}
              onChange={(e) =>
                handleChange("yColors", [e.target.value, formData.yColors[1]])
              }
            />
            <Input
              type="color"
              value={formData.yColors[1]}
              onChange={(e) =>
                handleChange("yColors", [formData.yColors[0], e.target.value])
              }
            />
          </Container>

          <Container TwClassName="gap-2">
            <Input
              type="color"
              value={formData.xColors[0]}
              onChange={(e) =>
                handleChange("xColors", [e.target.value, formData.xColors[1]])
              }
            />
            <Input
              type="color"
              value={formData.xColors[1]}
              onChange={(e) =>
                handleChange("xColors", [formData.xColors[0], e.target.value])
              }
            />
          </Container>

          <label className="flex flex-col text-sm text-gray-700">
            Cell Size: {formData.cellSize}
            <input
              type="range"
              min={10}
              max={200}
              value={formData.cellSize}
              onChange={(e) => handleChange("cellSize", Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Variance: {formData.variance.toFixed(1)}
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={formData.variance}
              onChange={(e) => handleChange("variance", Number(e.target.value))}
              className="w-full"
            />
          </label>
        </>
      )}

      {activeTab === "image" && (
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
          {!formData.auxImage ? (
            <div className="flex flex-col items-center text-gray-500">
              <Icon color="text-gray-900" name="Camera" TwClassName="w-10 h-10 mb-2" />
              <span className="text-sm">Click or drag image to upload</span>
            </div>
          ) : (
            <img
              src={formData.auxImage}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
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
      <Container TwClassName="flex-row gap-2 justify-between">
        {formData.auxImage && formData.auxImage === originalImage && (
          <Button
            TwClassName="flex-1 mt-2 p-2 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error"
            onClick={handleDeleteBannerImage}
          >
            {isProfileBanDeleting ? <Loader variant="spinner" color="bg-white-500" /> : <>Delete Banner</>}
          </Button>
        )}
        <Button
          onClick={handleBannerUploadAndSave}
          TwClassName="flex-1 mt-2 p-2 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary"
        >
          {isProfileBanUploading ? <Loader variant="spinner" color="bg-white-500" /> : <>Save</>}
        </Button>
      </Container>
      
    </Container>
  );
};

export default ProfileBannerModalContent;