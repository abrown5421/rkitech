import React, { useRef, useState } from "react";
import Container from "../../../components/container/Container";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import Icon from "../../../components/icon/Icon";
import TrianglifyBanner from "../../../components/trianglifyBanner/TrianglifyBanner";
import { fireModalAction, preCloseModal } from "../modalSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import type { TrianglifyBannerProps } from "../modalTypes";
import { setNotLoading } from "../../../../app/globalSlices/loading/loadingSlice";
import { uploadProfileImage } from "../../../../services/storage/uploadImage";
import { deleteImageFromStorage } from "../../../../services/storage/deleteImage";

const TrianglifyModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalProps = useAppSelector((state) => state.modal.modalProps);
  const authUser = useAppSelector((state) => state.authUser.user);
  
  const initialValues: TrianglifyBannerProps = {
    yColors: modalProps?.yColors || ["#ffffff", "#cccccc"],
    xColors: modalProps?.xColors || ["#000000", "#333333"],
    auxImage: modalProps?.auxImage || undefined,
    cellSize: modalProps?.cellSize || 50,
    variance: modalProps?.variance || 0.5,
    width: "w-full",
    height: 250,
  };

  const [activeTab, setActiveTab] = useState<"trianglify" | "image">(
    initialValues.auxImage ? "image" : "trianglify"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TrianglifyBannerProps>(initialValues);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (field: keyof TrianglifyBannerProps, value: any) => {
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

  const handleSave = async () => {
    if (!authUser?.userId) return;

    if (authUser.trianglifyObject.auxImage) {
        await deleteImageFromStorage(authUser.trianglifyObject.auxImage)
    }

    let imageUrl;
    if (activeTab === "image") {
        if (selectedFile) {
            imageUrl = await uploadProfileImage(selectedFile, authUser?.userId, 'profileBannerImages');
        } else {
            alert('No image uploaded.')
        }        
    }
    const resultData: TrianglifyBannerProps = {
      ...formData,
      auxImage: activeTab === "trianglify" ? '' : imageUrl,
    };

    dispatch(fireModalAction({
      modalActionFire: true,
      modalActionId: 'trianglifySave',
      trianglifyData: resultData,
    }));

    
    dispatch(setNotLoading())
    dispatch(preCloseModal());
  };

  const handleCancel = () => {
    dispatch(fireModalAction({
      modalActionFire: true,
      modalActionId: 'trianglifyCancel',
    }));
    dispatch(setNotLoading())
    dispatch(preCloseModal());
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
            handleChange("auxImage", undefined);
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
        auxImage={activeTab === "image" ? formData.auxImage : undefined}
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
            Variance: {formData.variance?.toFixed(1)}
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
          Save
        </Button>
      </Container>
    </Container>
  );
};

export default TrianglifyModal;