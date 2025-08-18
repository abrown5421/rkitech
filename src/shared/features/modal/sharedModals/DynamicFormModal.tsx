import React, { useState, useEffect, useRef } from "react";
import { fireModalAction, preCloseModal } from "../modalSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Container from "../../../components/container/Container";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import Select from "../../../components/select/Select";
import type { FormFieldConfig } from "../modalTypes";
import Icon from "../../../components/icon/Icon";
import type { ClientAuthUser } from "../../../../client/features/auth/ClientAuthUserTypes";
import {
  getDocumentByCondition,
  searchUsers,
} from "../../../../services/database/readData";
import Loader from "../../../components/loader/Loader";
import Image from "../../../components/image/Image";
import Text from "../../../components/text/Text";
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import { uploadImage } from '../../../../services/storage/uploadImage';

const DynamicFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalProps = useAppSelector((state) => state.modal.modalProps);
  const { loading, id } = useAppSelector((state) => state.loading);
  const savingImage = loading && id === 'savingImage';
  const config: FormFieldConfig[] = modalProps?.config || [];
  const actionId = modalProps?.actionId || "dynamicFormSave";
  const existingData = modalProps?.existingData || {};

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    config.forEach((field) => {
      initialData[field.nameId] =
        existingData[field.nameId] || field.defaultValue || "";
    });
    return initialData;
  });
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<ClientAuthUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<ClientAuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!searchValue.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const foundUsers = await searchUsers(searchValue, 5);
      setResults(foundUsers);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    const shouldReset =
      config.length > 0 &&
      (Object.keys(formData).length === 0 ||
        !config.every((field) => field.nameId in formData));

    if (shouldReset) {
      const newFormData: Record<string, string> = {};
      config.forEach((field) => {
        newFormData[field.nameId] =
          existingData[field.nameId] || field.defaultValue || "";
      });
      setFormData(newFormData);
    }
  }, [config]);

  const handleInputChange = (fieldNameId: string, value: string) => {
    if (fieldNameId === "staffUserId") {
      setSearchValue(value);
    }
    setFormData((prev) => ({
      ...prev,
      [fieldNameId]: value,
    }));

    if (errors[fieldNameId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldNameId]: "",
      }));
    }
  };

  const handleUserSelect = async (user: ClientAuthUser) => {
    const result = await getDocumentByCondition(
      "Staff",
      "staffUserId",
      user.userId
    );
    if (result) {
      alert("That user is already associated with a staff document.");
    } else {
      setSelectedUser(user);
      setFormData((prev) => ({
        ...prev,
        staffUserId: user.userId,
      }));

      setResults([]);
      setSearchValue(`${user.firstName} ${user.lastName} (${user.email})`);

      if (errors["staffUserId"]) {
        setErrors((prev) => ({
          ...prev,
          staffUserId: "",
        }));
      }
    }
  };

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
    setSelectedFile(null); // Clear file when switching to URL
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.forEach((field) => {
      if (field.required) {
        if (field.type === "imageinput") {
          if (!selectedFile && !urlInput.trim()) {
            newErrors[field.nameId] = `${field.name} is required`;
            isValid = false;
          }
        } else if (!formData[field.nameId] || formData[field.nameId].trim() === "") {
          newErrors[field.nameId] = `${field.name} is required`;
          isValid = false;
        }
      }
    });

    const userSearchField = config.find((field) => field.type === "usersearch");
    if (userSearchField && userSearchField.required && !selectedUser) {
      newErrors[userSearchField.nameId] = "Please select a user from the search results";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(setLoading({ loading: true, id: 'savingImage' }));

    let imageUrl = '';

    // Handle image upload logic
    const imageField = config.find(field => field.type === "imageinput");
    if (imageField) {
      if (activeTab === "url") {
        imageUrl = urlInput.trim();
      } else if (activeTab === "upload" && selectedFile) {
        try {
          // Use the same upload logic as PictureUploadModal
          imageUrl = await uploadImage(selectedFile, 'Gallery');
        } catch (error) {
          alert('Failed to upload image. Please try again.');
          dispatch(setNotLoading());
          return;
        }
      }
    }

    const finalFormData = {
      ...formData,
      staffUserId: selectedUser?.userId || formData.staffUserId,
      imageUrl: imageUrl, // Now this will be a proper URL string
    };

    dispatch(
      fireModalAction({
        modalActionFire: true,
        modalActionId: actionId,
        formData: finalFormData, 
      })
    );

    dispatch(setNotLoading());
    dispatch(preCloseModal());
  };

  const handleCancel = () => {
    dispatch(
      fireModalAction({
        modalActionFire: false,
        modalActionId: `${actionId}Cancel`,
      })
    );
    dispatch(setNotLoading());
    dispatch(preCloseModal());
  };

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      key: field.nameId,
      label: field.name + (field.required ? " *" : ""),
      value: formData[field.nameId] || "",
      error: !!errors[field.nameId],
      helperText: errors[field.nameId],
      placeholder: field.placeholder,
      type: field.inputType,
      step: field.step,
    };

    switch (field.type) {
      case "input":
        return (
          <Input
            {...commonProps}
            onChange={(e) => handleInputChange(field.nameId, e.target.value)}
          />
        );

      case "imageinput":
        return (
          <Container TwClassName="flex flex-col gap-4 min-w-150 relative">
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
                  error={!!errors[field.nameId]}
                  helperText={errors[field.nameId]}
                />
              </Container>
            )}

            {activeTab === "upload" && (
              <div
                className={`border-2 relative ${
                  isDragging
                    ? "border-primary bg-blue-50"
                    : "border-dashed border-gray-400"
                } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-48 transition-colors ${
                  errors[field.nameId] ? "border-red-500" : ""
                }`}
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
                    <Icon
                      color="text-gray-900"
                      name="Camera"
                      TwClassName="w-10 h-10 mb-2"
                    />
                    <span className="text-sm">
                      Click or drag image to upload
                    </span>
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
                    if (e.target.files?.[0])
                      handleFileChange(e.target.files[0]);
                  }}
                />
                {previewImage && (
                  <Container TwClassName="flex-row absolute top-0 right-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage("");
                        setUrlInput("");
                        setSelectedFile(null);
                      }}
                      TwClassName="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 h-10 w-10 m-2"
                    >
                      <Icon name="Trash" color="text-gray-900" />
                    </Button>
                  </Container>
                )}
              </div>
            )}
            {errors[field.nameId] && (
              <Text 
                text={errors[field.nameId]} 
                TwClassName="text-red-500 text-sm mt-1"
              />
            )}
          </Container>
        );

      case "usersearch":
        return (
          <Container TwClassName="flex flex-col">
            <Input
              {...commonProps}
              value={searchValue}
              onChange={(e) => handleInputChange(field.nameId, e.target.value)}
              endAdornment={
                <Icon
                  color="text-gray-900"
                  name="Search"
                  TwClassName="text-gray-500 hover:text-gray-700"
                />
              }
            />
            {selectedUser && (
              <Container TwClassName="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex-row items-center gap-2">
                <Text
                  text={`Selected: ${selectedUser.firstName} ${selectedUser.lastName}`}
                  TwClassName="text-blue-700 text-sm"
                />
                <Button
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData((prev) => ({
                      ...prev,
                      [field.nameId]: "",
                    }));
                    setSearchValue("");
                  }}
                  TwClassName="ml-auto text-blue-500 hover:text-blue-700 text-xs underline bg-transparent border-none p-0"
                >
                  Clear
                </Button>
              </Container>
            )}
          </Container>
        );

      case "textarea":
        return (
          <Input
            {...commonProps}
            multiline={true}
            rows={field.rows || 3}
            onChange={(e) => handleInputChange(field.nameId, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            creatable={field.creatable}
            onChange={(e) => handleInputChange(field.nameId, e.target.value)}
          >
            <option value="">Select {field.name}</option>
            {field.options?.map((option, index) => {
              if (typeof option === "string") {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              } else {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              }
            })}
          </Select>
        );

      default:
        return null;
    }
  };

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (!config || config.length === 0) {
    return (
      <Container TwClassName="flex flex-col gap-4 min-w-150">
        <p className="text-gray-500">No form configuration provided</p>
        <Container TwClassName="flex-row gap-2 justify-end">
          <Button
            onClick={handleCancel}
            TwClassName="min-w-[100px] py-1 px-2 bg-gray-300 rounded-xl text-white border-1 border-gray-300 hover:bg-transparent hover:text-gray-300"
          >
            Close
          </Button>
        </Container>
      </Container>
    );
  }

  return (
    <Container TwClassName="flex flex-col gap-4 min-w-150">
      {config.map((field) => renderField(field))}

      {!selectedUser && (
        <>
          {isSearching && (
            <Container TwClassName="flex-row w-full justify-center">
              <Loader variant="spinner" color="text-amber-500" />
            </Container>
          )}
          <Container TwClassName="flex flex-col space-y-2 cursor-pointer">
            {results.map((user) => (
              <Container
                key={user.userId}
                onClick={() => handleUserSelect(user)}
                TwClassName="flex-row items-start gap-3 border-b border-gray-300 m-0 pt-2 pb-2 hover:bg-gray-100"
              >
                <Container TwClassName="flex-col justify-center">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      TwClassName="-ml-1.5 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                    />
                  ) : (
                    <Container TwClassName="-ml-1.5 rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center border-3 border-white">
                      <Text
                        TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                        text={`${user.firstName?.[0] || ""}${
                          user.lastName?.[0] || ""
                        }`.toUpperCase()}
                      />
                    </Container>
                  )}
                </Container>
                <Container TwClassName="flex-col justify-center">
                  <Text
                    text={`${capitalize(user.firstName)} ${capitalize(
                      user.lastName
                    )}`}
                    TwClassName="font-semibold"
                  />
                  <Text TwClassName="text-sm text-gray-500" text={user.email} />
                </Container>
              </Container>
            ))}
          </Container>
        </>
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
          {savingImage ? <Loader variant='spinner' color='text-gray-50'/> : <>Save</>}
        </Button>
      </Container>
    </Container>
  );
};

export default DynamicFormModal;