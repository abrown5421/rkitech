import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import { useParams } from 'react-router-dom';
import { getDocumentById } from '../../services/database/readData';
import type { AuthUser } from '../auth/authUserTypes';
import Loader from '../../shared/components/loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLoading, setNotLoading } from '../../app/globalSlices/loading/loadingSlice';
import Text from '../../shared/components/text/Text';
import Image from '../../shared/components/image/Image';
import TrianglifyBanner from '../../shared/components/trianglifyBanner/TrianglifyBanner';
import { format } from 'date-fns';
import Button from '../../shared/components/button/Button';
import Icon from '../../shared/components/icon/Icon';
import { openModal, preCloseModal } from '../modal/modalSlice';
import { updateDataInCollection } from '../../services/database/updateData';
import { setAuthUser } from '../auth/authUserSlice';
import { sendEmailChangeVerification } from '../../services/auth/updateAuthProfile';
import { openAlert } from '../alert/alertSlice';

const Profile: React.FC = () => {
  const { userIdFromUrl } = useParams();
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const authUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = loading && id === 'profile';

  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userIdFromUrl) return;

      try {
        dispatch(setLoading({ loading: true, id: 'profile' }));

        const data = await getDocumentById('Users', userIdFromUrl);
        if (data) {
          setProfileUser(data as AuthUser);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        dispatch(setNotLoading());
      }
    };

    fetchProfileData();
  }, [userIdFromUrl, dispatch]);

  const handleProfileEditModal = () => {
    if (!profileUser) return;

    dispatch(
      openModal({
        title: 'Edit Profile',
        modalType: 'editProfile',
        modalProps: {
          firstName: profileUser.firstName,
          lastName: profileUser.lastName,
          email: profileUser.email,
          onSave: async (updatedData: { firstName: string; lastName: string; email: string; password?: string }) => {
            dispatch(setLoading({ loading: true, id: 'profileSave' }));

            const { firstName, lastName, email, password } = updatedData;
            const emailChanged = email !== profileUser.email;
            const nameChanged = firstName !== profileUser.firstName || lastName !== profileUser.lastName;

            try {
              const firestoreUpdate: Partial<AuthUser> = { firstName, lastName };

              if (emailChanged) {
                if (!password) throw new Error('Password required for email change');
                await sendEmailChangeVerification(email, password);
              } else {
                firestoreUpdate.email = email;
              }

              await updateDataInCollection('Users', userIdFromUrl ?? '', firestoreUpdate);

              const updatedUser: AuthUser = {
                ...profileUser,
                ...firestoreUpdate,
                userId: userIdFromUrl!,
              };
              dispatch(setAuthUser(updatedUser));
              setProfileUser(updatedUser);
              dispatch(preCloseModal());
              dispatch(setNotLoading());
              
              let alertMessage = 'Account update was successful!';
              if (emailChanged && nameChanged) {
                alertMessage = 'Name updated and verification email sent to your new address.';
              } else if (emailChanged) {
                alertMessage = 'A verification email has been sent to your new email address. Please verify to complete the update.';
              } else if (nameChanged) {
                alertMessage = 'Name updated successfully!';
              }

              dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'success',
                alertMessage,
                alertAnimation: {
                  entranceAnimation: 'animate__fadeInRight animate__faster',
                  exitAnimation: 'animate__fadeOutRight animate__faster',
                  isEntering: true,
                }
              }));

            } catch (error) {
              dispatch(setNotLoading());
              dispatch(preCloseModal());
              dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'error',
                alertMessage: 'Account update failed.',
                alertAnimation: {
                  entranceAnimation: 'animate__fadeInRight animate__faster',
                  exitAnimation: 'animate__fadeOutRight animate__faster',
                  isEntering: true,
                }
              }));
            }
          },
          onCancel: () => dispatch(preCloseModal()),
        },
      })
    );
  };

  return (
    <Container TwClassName="h-full w-full flex-col">
      {isProfileLoading ? (
        <Loader variant="spinner" color="bg-primary" />
      ) : profileUser ? (
        <>
          <TrianglifyBanner
            xColors={profileUser.trianglifyObject.xColors}
            yColors={profileUser.trianglifyObject.yColors}
            width={profileUser.trianglifyObject.width} 
            height={profileUser.trianglifyObject.height}
            variance={profileUser.trianglifyObject.variance}
            cellSize={profileUser.trianglifyObject.cellSize}
          />
          <Container TwClassName='absolute top-[245px] right-[5px]'>
            <Button
              cursor='pointer' 
              TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-primary hover:bg-gray-400 hover:border-primary p-2'
              onClick={handleProfileEditModal}
            >
              <Icon
                name='Edit'
                
              />
            </Button>
          </Container>
          <Container
            TwClassName='flex-col relative md:flex-row'
          >
            <Container
              TwClassName="flex-col flex-[3] relative min-w-[240px]"
            >
              <Container
                TwClassName="p-8 absolute top-0 transform -translate-y-1/2 z-10"
              >
                <Container TwClassName='absolute bottom-8 right-8'>
                  <Button
                    cursor='pointer' 
                    TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-primary hover:bg-gray-400 hover:border-primary p-2'
                    onClick={handleProfileEditModal}
                  >
                    <Icon
                      name='Camera'
                      
                    />
                  </Button>
                </Container>
                {profileUser?.profileImage ? (
                  <Image
                    src={profileUser.profileImage}
                    alt="User Avatar"
                    width={160}
                    height={160}
                    TwClassName="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <Container
                    TwClassName="w-[160px] h-[160px] rounded-full bg-black cursor-pointer flex justify-center items-center border-4 border-white shadow-lg"
                  >
                    <Text
                      TwClassName="text-white font-primary text-4xl w-full flex justify-center items-center"
                      text={`${profileUser.firstName?.[0] || ''}${profileUser.lastName?.[0] || ''}`.toUpperCase()}
                    />
                  </Container>
                )}
              </Container>

              <Container TwClassName="h-[80px] flex-row justify-end items-end">
                <span></span>
              </Container>

              <Container TwClassName="flex-col p-8 relative">
                {userIdFromUrl === authUser?.userId && (
                  <Container TwClassName='absolute right-8 top-8 md:right-2 md:top-2'>
                    <Button
                      cursor='pointer' 
                      TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-primary hover:bg-gray-400 hover:border-primary p-2'
                      onClick={handleProfileEditModal}
                    >
                      <Icon
                          name='Edit'
                      />
                    </Button>
                  </Container>
                )}
                
                <Text
                  TwClassName="text-black text-xl font-bold"
                  text={`${profileUser.firstName?.charAt(0).toUpperCase() || ''}${profileUser.firstName?.slice(1) || ''} ${profileUser.lastName?.charAt(0).toUpperCase() || ''}${profileUser.lastName?.slice(1) || ''}`}
                />
                <Text TwClassName="text-black text-md" text={profileUser.email} />
                <Text
                  text={`Member since: ${format(profileUser.createdAt, 'EEEE, MMMM do, yyyy')}`}
                  TwClassName="text-xs text-gray-500"
                />
              </Container>
            </Container>

            <Container TwClassName="flex-col flex-[9] p-8">
              <Container TwClassName="h-[80px] flex-row justify-end items-end hidden md:flex">
                <span></span>
              </Container>
              profile stuff
            </Container>
          </Container>
        </>
      ) : (
        <Container
          TwClassName="flex-col h-full w-full justify-center items-center"
        >
          <Text
            text="We are sorry there is no profile with that user ID."
            TwClassName="text-xl text-black"
          />
        </Container>
      )}
    </Container>
  );
};

export default Profile;
