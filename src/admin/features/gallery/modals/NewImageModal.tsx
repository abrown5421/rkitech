import React, { useRef, useState } from "react";
import type { DragEvent } from "react";
import Container from "../../../../shared/components/container/Container";
import Input from "../../../../shared/components/input/Input";
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
import { uploadImage } from "../../../../services/storage/uploadImage";
import { insertDataIntoCollection } from "../../../../services/database/createData";
import type { NewImageFormErrors, NewImageFormHelperTexts, NewImageFormValues } from "../galleryEditorTypes";

const NewImageModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);

  const [mode, setMode] = useState<"upload" | "url">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userUploadPreview, setUserUploadPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formValues, setFormValues] = useState<NewImageFormValues>({
    imageName: "",
    imageDescription: "",
    urlInput: "",
  });

  const [formErrors, setFormErrors] = useState<NewImageFormErrors>({
    imageName: false,
    imageDescription: false,
    urlInput: false,
  });

  const [helperTexts, setHelperTexts] = useState<NewImageFormHelperTexts>({
    imageName: "",
    imageDescription: "",
    urlInput: "",
  });

  const isLoading = (type: string) => loading && id === `${type}`;

  const previewURL =
    mode === "upload"
      ? userUploadPreview
      : formValues.urlInput.trim() !== ""
      ? formValues.urlInput
      : null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUserUploadPreview(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
      setFormValues((prev) => ({ ...prev, urlInput: "" }));
      setFormErrors((prev) => ({ ...prev, urlInput: false }));
      setHelperTexts((prev) => ({ ...prev, urlInput: "" }));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
      setFormValues((prev) => ({ ...prev, urlInput: "" }));
      setFormErrors((prev) => ({ ...prev, urlInput: false }));
      setHelperTexts((prev) => ({ ...prev, urlInput: "" }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prev) => ({ ...prev, [name]: false }));
    setHelperTexts((prev) => ({ ...prev, [name]: "" }));
  };

  const switchMode = (newMode: "upload" | "url") => {
    if (newMode === mode) return;

    setMode(newMode);

    if (newMode === "upload") {
      setFormValues((prev) => ({ ...prev, urlInput: "" }));
      setSelectedFile(null);
      setUserUploadPreview(null);

      setFormErrors((prev) => ({ ...prev, urlInput: false }));
      setHelperTexts((prev) => ({ ...prev, urlInput: "" }));
    } else {
      setSelectedFile(null);
      setUserUploadPreview(null);
      setFormValues((prev) => ({ ...prev, urlInput: "" }));

      setFormErrors((prev) => ({
        ...prev,
        urlInput: false,
      }));
      setHelperTexts((prev) => ({
        ...prev,
        urlInput: "",
      }));
    }
  };

  const handleSave = async () => {
    let valid = true;

    const newErrors: NewImageFormErrors = {
      imageName: false,
      imageDescription: false,
      urlInput: false,
    };

    const newHelperTexts: NewImageFormHelperTexts = {
      imageName: "",
      imageDescription: "",
      urlInput: "",
    };

    if (mode === "upload" && !selectedFile) {
      newErrors.urlInput = true; 
      newHelperTexts.urlInput = "Please upload an image file.";
      valid = false;
    }
    if (mode === "url" && formValues.urlInput.trim() === "") {
      newErrors.urlInput = true;
      newHelperTexts.urlInput = "Image URL is required.";
      valid = false;
    }

    if (formValues.imageName.trim() === "") {
      newErrors.imageName = true;
      newHelperTexts.imageName = "Image name is required.";
      valid = false;
    }

    if (formValues.imageDescription.trim() === "") {
      newErrors.imageDescription = true;
      newHelperTexts.imageDescription = "Image description is required.";
      valid = false;
    }

    setFormErrors(newErrors);
    setHelperTexts(newHelperTexts);

    if (!valid) {
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage:
            "Please provide an image, a name, and a description before saving.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      return;
    }

    dispatch(setLoading({ loading: true, id: "save-image" }));

    try {
      let finalImageUrl = "";

      if (mode === "upload" && selectedFile) {
        finalImageUrl = await uploadImage(selectedFile, "/Gallery/");
      } else if (mode === "url") {
        finalImageUrl = formValues.urlInput.trim();
      }

      const newImageObject = {
        imageActive: false,
        imageUpload: mode === "upload",
        imageDate: new Date().toISOString(),
        imageName: formValues.imageName.trim(),
        imageDescription: formValues.imageDescription.trim(),
        imageUrl: finalImageUrl,
      };

      await insertDataIntoCollection("Gallery", newImageObject);

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
          name="urlInput"
          TwClassName="flex-grow"
          label="Image URL"
          value={formValues.urlInput}
          onChange={handleInputChange}
          error={formErrors.urlInput}
          helperText={helperTexts.urlInput}
        />
      )}

      <Input
        name="imageName"
        label="Name"
        value={formValues.imageName}
        onChange={handleInputChange}
        placeholder="Enter image name"
        error={formErrors.imageName}
        helperText={helperTexts.imageName}
      />
      <Input
        name="imageDescription"
        label="Description"
        value={formValues.imageDescription}
        onChange={handleInputChange}
        placeholder="Enter image description"
        error={formErrors.imageDescription}
        helperText={helperTexts.imageDescription}
      />

      <Button
        onClick={handleSave}
        disabled={isLoading("save-image")}
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

export default NewImageModal;