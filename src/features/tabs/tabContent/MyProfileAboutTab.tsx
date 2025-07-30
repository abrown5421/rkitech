import React, { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import Container from "../../../shared/components/container/Container";
import type { ProfileTab } from "../tabTypes";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Text from "../../../shared/components/text/Text";
import Image from "../../../shared/components/image/Image";
import Input from "../../../shared/components/input/Input";
import { openAlert } from "../../alert/alertSlice";
import {
  setLoading,
  setNotLoading,
} from "../../../app/globalSlices/loading/loadingSlice";
import { setAuthUser } from "../../auth/authUserSlice";
import type { AuthUser } from "../../auth/authUserTypes";
import { updateDataInCollection } from "../../../services/database/updateData";
import {
  sendEmailChangeVerification,
  updateUserPassword,
} from "../../../services/auth/updateAuthProfile";
import Button from "../../../shared/components/button/Button";
import Loader from "../../../shared/components/loader/Loader";
import {
  uploadProfileImage,
} from "../../../services/storage/uploadImage";
import { deleteImageFromStorage } from "../../../services/storage/deleteImage";
import Icon from "../../../shared/components/icon/Icon";

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;

const MyProfileAboutTab: React.FC<ProfileTab> = ({ profileUser }) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfileSaving = loading && id === "profileSave";
  const isProfileRestoring = loading && id === "profileRestore";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: profileUser.firstName || "",
    lastName: profileUser.lastName || "",
    email: profileUser.email || "",
    phone: profileUser.phone || "",
    addressLn1: profileUser.addressLn1 || "",
    addressLn2: profileUser.addressLn2 || "",
    addressCity: profileUser.addressCity || "",
    addressState: profileUser.addressState || "",
    addressPostCode: profileUser.addressPostCode || "",
    bio: profileUser.bio || "",
    password: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    selectedFile: null as File | null,
  });

  const [previewURL, setPreviewURL] = useState<string | null>(
    authUser?.profileImage || null
  );

  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailChanged = form.email !== profileUser.email;
  const nameChanged =
    form.firstName !== profileUser.firstName ||
    form.lastName !== profileUser.lastName;

  useEffect(() => {
    if (authUser?.profileImage && !form.selectedFile) {
      setPreviewURL(authUser.profileImage);
    }
  }, [authUser?.profileImage, form.selectedFile]);

  const handleInputChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleFileSelect = (file: File) => {
    handleInputChange("selectedFile", file);
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
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (form.phone && !PHONE_REGEX.test(form.phone)) {
      newErrors.phone = "Phone number must be in 555-555-5555 format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function validatePasswordFields() {
    if (!form.oldPassword || !form.newPassword || !form.confirmNewPassword) {
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Please fill out all password fields.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      return false;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "New password and confirmation do not match.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      return false;
    }
    return true;
  }

  const handleDeleteProfilePicture = async () => {
    if (!authUser?.userId || !authUser.profileImage) return;

    dispatch(setLoading({ loading: true, id: "profilePicDeleting" }));

    try {
      await deleteImageFromStorage(authUser.profileImage);
      await updateDataInCollection("Users", authUser.userId, {
        profileImage: "",
      });

      setPreviewURL(null);
      handleInputChange("selectedFile",null);

      dispatch(setNotLoading());
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage: "Profile Picture has been deleted.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(setNotLoading());
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Failed to delete Profile Picture.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    }
  };

  const handleRestore = () => {
    dispatch(setLoading({ loading: true, id: "profileRestore" }));
    setForm({
      firstName: profileUser.firstName || "",
      lastName: profileUser.lastName || "",
      email: profileUser.email || "",
      phone: profileUser.phone || "",
      addressLn1: profileUser.addressLn1 || "",
      addressLn2: profileUser.addressLn2 || "",
      addressCity: profileUser.addressCity || "",
      addressState: profileUser.addressState || "",
      addressPostCode: profileUser.addressPostCode || "",
      bio: profileUser.bio || "",
      password: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      selectedFile: null as File | null,
    });

    handleInputChange("selectedFile",null);
    setPreviewURL(authUser?.profileImage || null);
    setErrors({});
    dispatch(setNotLoading());
  };

  const handleSave = async () => {
    if (!validateFields()) {
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage:
            "Please fix the errors before saving your profile.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      return;
    }

    dispatch(setLoading({ loading: true, id: "profileSave" }));

    try {
      const firestoreUpdate: Partial<AuthUser> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        addressLn1: form.addressLn1,
        addressLn2: form.addressLn2,
        addressCity: form.addressCity,
        addressState: form.addressState,
        addressPostCode: form.addressPostCode,
        bio: form.bio,
      };

      if (emailChanged) {
        if (!form.password) throw new Error("Password required for email change");
        await sendEmailChangeVerification(form.email, form.password);
      }

      if (form.selectedFile && authUser?.userId) {
        if (authUser.profileImage) {
          await deleteImageFromStorage(authUser.profileImage);
        }

        const imageUrl = await uploadProfileImage(
          form.selectedFile,
          authUser.userId,
          "profileImages"
        );

        firestoreUpdate.profileImage = imageUrl;
        setPreviewURL(imageUrl);
      }

      await updateDataInCollection(
        "Users",
        profileUser.userId ?? "",
        firestoreUpdate
      );

      if (form.oldPassword || form.newPassword || form.confirmNewPassword) {
        if (!validatePasswordFields()) {
          dispatch(setNotLoading());
          return;
        }
        await updateUserPassword(form.oldPassword, form.newPassword);
      }

      const updatedUser: AuthUser = {
        ...authUser!,
        ...firestoreUpdate,
        userId: profileUser.userId,
      };

      dispatch(setAuthUser(updatedUser));

      let alertMessage = "Account update was successful!";
      if (emailChanged && nameChanged) {
        alertMessage =
          "Name updated and verification email sent to your new address.";
      } else if (emailChanged) {
        alertMessage =
          "A verification email has been sent to your new email address. Please verify to complete the update.";
      } else if (nameChanged) {
        alertMessage = "Name updated successfully!";
      }

      if (form.selectedFile) {
        alertMessage += " Profile picture updated.";
      }

      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage,
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );

      handleInputChange("selectedFile", null);
      handleInputChange("password", "")
      handleInputChange("oldPassword", "")
      handleInputChange("newPassword", "")
      handleInputChange("confirmNewPassword", "")
      dispatch(setNotLoading());
    } catch (error) {
      console.error(error);
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Account update failed.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
      dispatch(setNotLoading());
    }
  };

  return (
    <>
      <Container TwClassName="flex-row gap-5 justify-between">
        <Container TwClassName="flex-col flex-3">
          <div
            className={`border-2 ${
              isDragging
                ? "border-primary bg-blue-50"
                : "border-dashed border-gray-400"
            } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-60 transition-colors`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            {authUser?.profileImage && (
              <Container
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProfilePicture();
                }}
                TwClassName="absolute top-2 right-2 cursor-pointer z-50 text-error hover:text-error-hover"
              >
                <Icon name="Trash" />
              </Container>
            )}
            {!previewURL ? (
              <Container TwClassName="flex flex-col items-center text-gray-500">
                <Icon name="Camera" TwClassName="w-10 h-10 mb-2" />

                <span className="text-sm">Click or drag image to upload</span>
              </Container>
            ) : (
              <Image
                src={previewURL}
                alt="Preview"
                TwClassName="absolute inset-0 w-full h-full object-contain rounded-lg"
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
        </Container>
        <Container TwClassName="flex-col flex-8 gap-5">
          <Text
            TwClassName="text-black text-xl font-bold"
            text="Personal Information"
          />
          <Container TwClassName="flex-row justify-between gap-5">
            <Container TwClassName="flex-col flex-1">
              <Input
                label="First Name"
                value={form.firstName}
                error={!!errors.firstName}
                helperText={errors.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </Container>
            <Container TwClassName="flex-col flex-1">
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </Container>
          </Container>

          <Input
            label="Bio"
            value={form.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            multiline
            rows="fill"
          />
        </Container>
      </Container>
      <Container TwClassName="flex-row gap-5 justify-between">
        <Container TwClassName="flex-col flex-8 gap-5 mt-5">
          <Text
            TwClassName="text-black text-xl font-bold"
            text="Contact Information"
          />
          <Input
            label="Phone"
            value={form.phone}
            error={!!errors.phone}
            helperText={errors.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <Container TwClassName="flex-row gap-5 justify-between">
            <Container TwClassName="flex-col flex-1">
              <Input
                label="Address Line 1"
                value={form.addressLn1}
                onChange={(e) => handleInputChange("addressLn1", e.target.value)}
              />
            </Container>
            <Container TwClassName="flex-col flex-1">
              <Input
                label="Address Line 2"
                value={form.addressLn2}
                onChange={(e) => handleInputChange("addressLn2", e.target.value)}
              />
            </Container>
          </Container>
          <Container TwClassName="flex-row gap-5 justify-between">
            <Container TwClassName="flex-col flex-1">
              <Input
                label="City"
                value={form.addressCity}
                onChange={(e) => handleInputChange("addressCity", e.target.value)}
              />
            </Container>
            <Container TwClassName="flex-col flex-1">
              <Input
                label="State"
                value={form.addressState}
                onChange={(e) => handleInputChange("addressState", e.target.value)}
              />
            </Container>
            <Container TwClassName="flex-col flex-1">
              <Input
                label="Post Code"
                value={form.addressPostCode}
                onChange={(e) => handleInputChange("addressPostCode", e.target.value)}
              />
            </Container>
          </Container>
          <Input
            label="Email"
            value={form.email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          {emailChanged && (
            <Input
              label="Current Password"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              helperText="To change your email we must verify your password"
            />
          )}
        </Container>
      </Container>
      <Container TwClassName="flex-row gap-5 justify-between">
        <Container TwClassName="flex-col flex-8 gap-5 mt-5">
          <Text
            TwClassName="text-black text-xl font-bold"
            text="Account Information"
          />
          <Container TwClassName="flex-col gap-4">
            <Input
              label="Old Password"
              type="password"
              value={form.oldPassword}
              onChange={(e) => handleInputChange("oldPassword", e.target.value)}
              placeholder="Enter your current password"
            />
            <Input
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Enter your new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={form.confirmNewPassword}
              onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
              placeholder="Confirm your new password"
            />
          </Container>
        </Container>
      </Container>
      <Container TwClassName="flex-row gap-5 mt-5 justify-end">
        <Button
          TwClassName="p-2 bg-gray-300 rounded-xl text-black border-1 min-w-[150px] border-gray-300 hover:bg-transparent hover:text-gray-300"
          onClick={handleRestore}
          disabled={isProfileRestoring}
        >
          {isProfileRestoring ? (
            <Loader variant="spinner" color="bg-primary" />
          ) : (
            "Restore Changes"
          )}
        </Button>
        <Button
          TwClassName="p-2 bg-primary rounded-xl text-white border-1 min-w-[150px] border-primary hover:bg-transparent hover:text-primary"
          onClick={handleSave}
          disabled={isProfileSaving || (emailChanged && !form.password)}
        >
          {isProfileSaving ? (
            <Loader variant="spinner" color="bg-primary" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Container>
    </>
  );
};

export default MyProfileAboutTab;
