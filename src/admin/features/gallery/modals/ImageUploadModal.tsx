import React, { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import Container from "../../../../shared/components/container/Container";
import Input from "../../../../shared/components/input/Input";
import type { ImageUploadModalContentProps } from "../../../../shared/features/modal/modalTypes";
import Icon from "../../../../shared/components/icon/Icon";
import Image from "../../../../shared/components/image/Image";
import Button from "../../../../shared/components/button/Button";
import Loader from "../../../../shared/components/loader/Loader";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  setLoading,
  setNotLoading,
} from "../../../../app/globalSlices/loading/loadingSlice";
import { preCloseModal } from "../../../../shared/features/modal/modalSlice";
import { openAlert } from "../../../../shared/features/alert/alertSlice";
import { updateDataInCollection } from "../../../../services/database/updateData";
import { uploadImage } from "../../../../services/storage/uploadImage";
import { deleteImageFromStorage } from "../../../../services/storage/deleteImage";

const ImageUploadModal: React.FC<ImageUploadModalContentProps> = ({
  imageUrl: initialUrl,
  imageUpload,
  imagePostId,
}) => {
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const initialMode = imageUpload ? "upload" : "url";
  const [mode, setMode] = useState<"upload" | "url">(initialMode);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const isLoading = (type: string, postId?: string) =>
    loading && id === `${type}${postId ? "-" + postId : ""}`;

  const [initialUploadPreview, setInitialUploadPreview] = useState<
    string | null
  >(initialMode === "upload" ? initialUrl || null : null);
  const [initialUrlPreview, setInitialUrlPreview] = useState<string | null>(
    initialMode === "url" ? initialUrl || null : null
  );

  const [userUploadPreview, setUserUploadPreview] = useState<string | null>(
    null
  );
  const [userUrlPreview, setUserUrlPreview] = useState<string | null>(null);

  const [urlInput, setUrlInput] = useState(
    initialMode === "url" ? initialUrl || "" : ""
  );

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (imageUpload) {
      setInitialUploadPreview(initialUrl || null);
    } else {
      setInitialUrlPreview(initialUrl || null);
      setUrlInput(initialUrl || "");
    }
  }, [initialUrl, imageUpload]);

  const previewURL =
    mode === "upload"
      ? userUploadPreview ?? initialUploadPreview
      : userUrlPreview ?? initialUrlPreview;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);

    setUserUploadPreview(objectUrl);
    setInitialUploadPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleUrlInputChange = (value: string) => {
    setUrlInput(value);

    if (value.trim() === "") {
      setUserUrlPreview(null);
    } else {
      setUserUrlPreview(value);
      setInitialUrlPreview(null);
    }
  };

  const switchMode = (newMode: "upload" | "url") => {
    if (newMode === mode) return;

    setMode(newMode);
  };

  const handleSave = async () => {
    dispatch(setLoading({ loading: true, id: "save-image" }));

    if (!imagePostId) {
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Gallery image upload failed: missing image post ID.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      dispatch(setNotLoading());
      return;
    }

    try {
      if (mode === "upload") {
        if (!selectedFile) {
          dispatch(
            openAlert({
              alertOpen: true,
                alertSeverity: "error",
                alertMessage: "Gallery image upload failed: no file uploaded.",
                alertAnimation: {
                    entranceAnimation: "animate__fadeInRight animate__faster",
                    exitAnimation: "animate__fadeOutRight animate__faster",
                    isEntering: true,
                },
            })
          );
          dispatch(setNotLoading());
          return;
        }

        if (initialUrl && mode !== "upload" && initialMode === "upload") {
          await deleteImageFromStorage(initialUrl);
        }

        const imageUrl = await uploadImage(selectedFile, "/Gallery/");
        await updateDataInCollection("Gallery", imagePostId, {
          imageUrl: imageUrl,
        });
      } else {
        await updateDataInCollection("Gallery", imagePostId, {
          imageUrl: urlInput,
        });
      }

      dispatch(preCloseModal());
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage: "Gallery image was uploaded successfully!",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } catch (error) {
      dispatch(preCloseModal());
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Gallery image upload failed.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } finally {
      dispatch(setNotLoading());
    }
  };

  return (
    <Container TwClassName="flex-col h-full gap-4">
      <Container TwClassName="flex gap-2 pb-2 min-w-150">
        <Button
          TwClassName={`px-3 py-1 rounded-xl ${
            mode === "upload" ? "bg-primary text-white" : "bg-gray-200"
          }`}
          onClick={() => switchMode("upload")}
        >
          Upload
        </Button>
        <Button
          TwClassName={`px-3 py-1 rounded-xl ${
            mode === "url" ? "bg-primary text-white" : "bg-gray-200"
          }`}
          onClick={() => switchMode("url")}
        >
          URL
        </Button>
      </Container>

      <div
        className={`border-2 ${
          isDragging
            ? "border-primary bg-blue-50"
            : "border-dashed border-gray-400"
        } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-100 transition-colors`}
        onClick={() => mode === "upload" && fileInputRef.current?.click()}
        onDrop={mode === "upload" ? handleDrop : undefined}
        onDragOver={(e) => {
          if (mode === "upload") {
            e.preventDefault();
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {!previewURL ? (
          <Container TwClassName="flex flex-col items-center text-gray-500">
            <Icon
              color="text-gray-900"
              name="Camera"
              TwClassName="w-10 h-10 mb-2"
            />
            <span className="text-sm">
              {mode === "upload"
                ? "Click or drag image to upload"
                : "Enter an image URL below"}
            </span>
          </Container>
        ) : (
          <Image
            src={previewURL}
            alt="Preview"
            TwClassName="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        )}

        {mode === "upload" && (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>

      {mode === "url" && (
        <Input
          TwClassName="flex-grow"
          label="Image URL"
          value={urlInput}
          onChange={(e) => handleUrlInputChange(e.target.value)}
        />
      )}
      <Button
        onClick={handleSave}
        TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white"
      >
        {isLoading("save-image") ? (
          <Loader variant="spinner" color="amber-500" />
        ) : (
          "Save"
        )}
      </Button>
    </Container>
  );
};

export default ImageUploadModal;
