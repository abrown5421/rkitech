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
import { updateAuthProfile } from '../../services/auth/updateAuthProfile';
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
          onSave: async (updatedData: { firstName: string; lastName: string; email: string }) => {
            dispatch(setLoading({ loading: true, id: 'profileSave' }));
            try {
              await updateDataInCollection('Users', userIdFromUrl ?? '', {
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email,
              });

              await updateAuthProfile({
                displayName: `${updatedData.firstName} ${updatedData.lastName}`,
              });

              const updatedUser = {
                ...profileUser,
                userId: userIdFromUrl!, 
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                email: updatedData.email,
              };
              
              dispatch(setAuthUser(updatedUser)); 

              dispatch(preCloseModal());
              setProfileUser(updatedUser);
              dispatch(setNotLoading());
              dispatch(openAlert({
                  alertOpen: true,
                  alertSeverity: 'success',
                  alertMessage: 'Account update was successful!',
                  alertAnimation: {
                      entranceAnimation: 'animate__fadeInRight animate__faster',
                      exitAnimation: 'animate__fadeOutRight animate__faster',
                      isEntering: true,
                  }
              }));
            } catch (error) {
              dispatch(setNotLoading());
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
          onCancel: () => {
            dispatch(preCloseModal());
          },
        },
      })
    );
  };

  return (
    <Container height="h-full" width="w-full" flexDirection="col">
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

          <Container
            flexDirection="row"
            className="relative"
          >
            <Container
              flexDirection="col"
              className="flex-[3] relative min-w-[240px]"
            >
              <Container
                padding='xl'
                className="absolute top-0 transform -translate-y-1/2 z-10"
              >
                {profileUser?.profileImage ? (
                  <Image
                    src={profileUser.profileImage}
                    alt="User Avatar"
                    width={160}
                    height={160}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <Container
                    width={160}
                    height={160}
                    className="rounded-full bg-black cursor-pointer flex justify-center items-center border-4 border-white shadow-lg"
                  >
                    <Text
                      color="text-white"
                      font="primary"
                      size="6x"
                      className="w-full flex justify-center items-center"
                      text={`${profileUser.firstName?.[0] || ''}${profileUser.lastName?.[0] || ''}`.toUpperCase()}
                    />
                  </Container>
                )}
              </Container>

              <Container height={80} flexDirection='row' justifyContent='end' alignItems='end'>
                <span></span>
              </Container>

              <Container flexDirection="col" padding='xl' className='relative'>
                {userIdFromUrl === authUser?.userId && (
                  <Container className='absolute right-0'>
                    <Button
                      customColorClasses={{
                        bg: 'bg-gray-200',
                        text: 'text-black',
                        hoverText: 'text-primary',
                        border: 'border-gray-200',
                        hoverBg: 'hover:bg-white',
                      }}
                      variant='solid'
                      rounded='full'
                      padding='sm' 
                      cursor='pointer' 
                      className='rounded-full'
                      onClick={handleProfileEditModal}
                    >
                      <Icon
                          name='Edit'
                      />
                    </Button>
                  </Container>
                )}
                
                <Text
                  color="text-black"
                  size="xl"
                  bold
                  text={profileUser.firstName + ' ' + profileUser.lastName}
                />
                <Text color="text-black" size="md" text={profileUser.email} />
                <Text
                  text={`Member since: ${format(profileUser.createdAt, 'EEEE, MMMM do, yyyy')}`}
                  size="xs"
                  color="text-gray-500"
                />
              </Container>
            </Container>

            <Container flexDirection="col" className="flex-[9]" padding='xl'>
              profile stuff
            </Container>
          </Container>
        </>
      ) : (
        <Container
          flexDirection="col"
          height="h-full"
          width="w-full"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            text="We are sorry there is no profile with that user ID."
            size="xl"
            color="text-black"
          />
        </Container>
      )}
    </Container>
  );
};

export default Profile;
