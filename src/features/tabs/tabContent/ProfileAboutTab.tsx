import React, { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import Container from "../../../shared/components/container/Container";
import type { ProfileAboutTabProps } from "../tabTypes";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Text from "../../../shared/components/text/Text";
import { format } from "date-fns";
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
import { sendEmailChangeVerification } from "../../../services/auth/updateAuthProfile";
import Button from "../../../shared/components/button/Button";
import Loader from "../../../shared/components/loader/Loader";
import { uploadProfileImage } from "../../../services/storage/uploadImage";
import { deleteImageFromStorage } from "../../../services/storage/deleteImage";
import Icon from "../../../shared/components/icon/Icon";

const ProfileAboutTab: React.FC<ProfileAboutTabProps> = (profileUser) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser.user);
  const ownedProfile = profileUser.profileUser.userId === authUser?.userId;
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfileSaving = loading && id === "profileSave";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(profileUser.profileUser.firstName);
  const [lastName, setLastName] = useState(profileUser.profileUser.lastName);
  const [email, setEmail] = useState(profileUser.profileUser.email);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(
    authUser?.profileImage || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const emailChanged = email !== profileUser.profileUser.email;
  const nameChanged =
    firstName !== profileUser.profileUser.firstName ||
    lastName !== profileUser.profileUser.lastName;

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
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleDeleteProfilePicture = async () => {
    if (!authUser?.userId || !authUser.profileImage) return;

    dispatch(setLoading({ loading: true, id: "profilePicDeleting" }));

    try {
      await deleteImageFromStorage(authUser.profileImage);
      await updateDataInCollection("Users", authUser.userId, {
        profileImage: "",
      });

      setPreviewURL(null);
      setSelectedFile(null);

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

  const handleSave = async () => {
    dispatch(setLoading({ loading: true, id: "profileSave" }));

    try {
      const firestoreUpdate: Partial<AuthUser> = { firstName, lastName };

      if (emailChanged) {
        if (!password) throw new Error("Password required for email change");
        await sendEmailChangeVerification(email, password);
      } else {
        firestoreUpdate.email = email;
      }

      if (selectedFile && authUser?.userId) {
        if (authUser.profileImage) {
          await deleteImageFromStorage(authUser.profileImage);
        }

        const imageUrl = await uploadProfileImage(
          selectedFile,
          authUser.userId,
          "profileImages"
        );

        firestoreUpdate.profileImage = imageUrl;
        setPreviewURL(imageUrl); 
      }

      await updateDataInCollection(
        "Users",
        profileUser.profileUser.userId ?? "",
        firestoreUpdate
      );

      const updatedUser: AuthUser = {
        ...authUser!,
        ...firestoreUpdate,
        userId: profileUser.profileUser.userId,
      };

      dispatch(setAuthUser(updatedUser));
      dispatch(setNotLoading());

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

      if (selectedFile) {
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

      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      dispatch(setNotLoading());
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
    }
  };

  return (
    <>
      {ownedProfile ? (
        <Container TwClassName="flex-row gap-5 justify-between">
          <Container TwClassName="flex-col flex-3">
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
              {authUser?.profileImage && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfilePicture();
                  }}
                  className="absolute top-2 right-2 cursor-pointer z-50 text-error hover:text-error-hover"
                >
                  <Icon name="Trash" />
                </div>
              )}
              {!previewURL ? (
                <div className="flex flex-col items-center text-gray-500">
                  <Icon name="Camera" TwClassName="w-10 h-10 mb-2" />
                  
                  <span className="text-sm">Click or drag image to upload</span>
                </div>
              ) : (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain rounded-lg"
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
            <Container TwClassName="flex-row justify-between gap-5">
                <Container TwClassName="flex-col flex-1">
                    <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Container>
                <Container TwClassName="flex-col flex-1">
                    <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Container>
            </Container>
            
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {emailChanged && (
              <Input
                label="Current Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to confirm email change"
              />
            )}

            <Container TwClassName="flex-row justify-end gap-2 mt-4">
              <Button
                TwClassName="p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary"
                onClick={handleSave}
                disabled={emailChanged && !password}
              >
                {isProfileSaving ? (
                  <Loader variant="spinner" color="bg-primary" />
                ) : (
                  "Save"
                )}
              </Button>
            </Container>
          </Container>
        </Container>
      ) : (
        <Container TwClassName="flex-row">
          <Container TwClassName="flex-col flex-1">
            {profileUser.profileUser?.profileImage ? (
              <Image
                src={profileUser.profileUser.profileImage}
                alt="User Avatar"
                width={100}
                height={100}
                TwClassName="rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <Container TwClassName="w-[100px] h-[100px] rounded-full bg-black cursor-pointer flex justify-center items-center border-4 border-white shadow-lg">
                <Text
                  TwClassName="text-white font-primary text-4xl w-full flex justify-center items-center"
                  text={`${profileUser.profileUser.firstName?.[0] || ""}${
                    profileUser.profileUser.lastName?.[0] || ""
                  }`.toUpperCase()}
                />
              </Container>
            )}
          </Container>
          <Container TwClassName="flex-col flex-9 justify-center">
            <Text
              TwClassName="text-black text-xl font-bold"
              text={`${
                profileUser.profileUser.firstName?.charAt(0).toUpperCase() || ""
              }${profileUser.profileUser.firstName?.slice(1) || ""} ${
                profileUser.profileUser.lastName?.charAt(0).toUpperCase() || ""
              }${profileUser.profileUser.lastName?.slice(1) || ""}`}
            />
            <Text
              TwClassName="text-black text-md"
              text={profileUser.profileUser.email}
            />
            <Text
              text={`Member since: ${format(
                profileUser.profileUser.createdAt,
                "EEEE, MMMM do, yyyy"
              )}`}
              TwClassName="text-xs text-gray-500"
            />
          </Container>
        </Container>
      )}
    </>
  );
};
export default ProfileAboutTab;
