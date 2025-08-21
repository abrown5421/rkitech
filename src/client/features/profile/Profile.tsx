
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ClientAuthUser } from '../auth/ClientAuthUserTypes';
import { format } from 'date-fns';
import FriendProfileModule from '../friends/FriendProfileModule';
import { fetchProfileFriends } from '../../hooks/useTheirFriends';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { getDocumentById } from '../../../services/database/readData';
import { openModal } from '../../../shared/features/modal/modalSlice';
import type { TabItem } from '../../../shared/features/tabs/tabTypes';
import ProfileMainTab from './tabs/ProfileMainTab';
import ProfileFriendSearchTab from '../friends/tabs/ProfileFriendSearchTab';
import ProfileFriendRequestTab from '../friends/tabs/ProfileFriendRequestTab';
import ProfileFriendsTab from '../friends/tabs/ProfileFriendsTab';
import ProfileFriendMutalsTab from '../friends/tabs/ProfileFriendMutalsTab';
import Container from '../../../shared/components/container/Container';
import Loader from '../../../shared/components/loader/Loader';
import TrianglifyBanner from '../../../shared/components/trianglifyBanner/TrianglifyBanner';
import Button from '../../../shared/components/button/Button';
import Icon from '../../../shared/components/icon/Icon';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';
import Tabs from '../../../shared/features/tabs/Tabs';
import MyProfileAboutTab from './tabs/MyProfileAboutTab';
import { TheirProfileAboutTab } from './tabs/TheirProfileAboutTab';
import ProfileSettingsTab from './tabs/ProfileSettingsTab';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { updateDataInCollection } from '../../../services/database/updateData';

const Profile: React.FC = () => {
  const { userIdFromUrl } = useParams();
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const modalAction = useAppSelector((state) => state.modal.modalActionFire);
  const authUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = loading && id === 'profile';
  const [profileUser, setProfileUser] = useState<ClientAuthUser | null>(null);
  const [activeProfileSection, setActiveProfileSection] = useState<string>('Main');
  const ownedProfile = authUser?.userId === userIdFromUrl;

  useEffect(() => {
    if (!userIdFromUrl) return;

    const unsubscribe = fetchProfileFriends(userIdFromUrl, dispatch);

    return () => {
      unsubscribe();
    };
  }, [userIdFromUrl, dispatch]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userIdFromUrl) return;

      try {
        dispatch(setLoading({ loading: true, id: 'profile' }));
        if (ownedProfile) {
          setProfileUser(authUser)
        } else {
          const data = await getDocumentById('Users', userIdFromUrl);
          if (data) {
            setProfileUser({ ...(data as ClientAuthUser), userId: userIdFromUrl });
          }     
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        dispatch(setNotLoading());
      }
    };

    fetchProfileData();
  }, [userIdFromUrl, authUser, dispatch]);

  useEffect(() => {
    if (!modalAction.modalActionFire || !authUser) return;

    const runTrianglifyAction = async () => {
      if (modalAction.modalActionId === 'trianglifySave') {
        const trianglifyData = modalAction.trianglifyData; 
        await updateDataInCollection("Users", authUser.userId, {
          trianglifyObject: trianglifyData,
        });

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

      } else if (modalAction.modalActionId === 'trianglifyCancel') {
        console.log('User canceled trianglify modal');
      }
    };
    
    const runPfpAction = async () => {
      if (modalAction.modalActionId === 'pictureUpload') {

        await updateDataInCollection("Users", authUser.userId, {
          profileImage: modalAction.imageUrl,
        });

        dispatch(openAlert({
          alertOpen: true,
          alertSeverity: 'success',
          alertMessage: 'Profile picture was uploaded successfully!',
          alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
          }
        }));

      } else if (modalAction.modalActionId === 'trianglifyCancel') {
        console.log('User canceled profile upload modal');
      }
    };

    runTrianglifyAction();
    runPfpAction();
  }, [modalAction]);

  const openProfilePictureModal = () => {
    dispatch(openModal({
      title: 'Add A Profile Picture',
      modalType: 'pictureUpload',
      modalMessage: '',
      modalProps: {
        existingImage: profileUser?.profileImage,
        uploadDir: 'profileImages'
      }
    }));
  };

  const openTrianglifyModal = () => {
    dispatch(openModal({
      title: 'Customize Banner',
      modalType: 'trianglify',
      modalMessage: '',
      modalProps: {
        yColors: profileUser?.trianglifyObject.yColors,
        xColors: profileUser?.trianglifyObject.xColors,
        cellSize: profileUser?.trianglifyObject.cellSize,
        variance: profileUser?.trianglifyObject.variance,
        width: profileUser?.trianglifyObject.width,
        height: profileUser?.trianglifyObject.height,
        auxImage: profileUser?.trianglifyObject.auxImage,
        existingImage: profileUser?.trianglifyObject.auxImage,
        RecordIdToUpdate: profileUser?.userId,
        uploadDir: 'profileBannerImages'
      }
    }));
  };

  const mainTabData: TabItem[] = [
    {
      id: 'testTab',
      label: 'Tab',
      content: <ProfileMainTab />,
    }
  ];

  const friendTabData: TabItem[] = [
  ...(ownedProfile
    ? [
        {
          id: 'friendSearch',
          label: 'Friend Search',
          content: <ProfileFriendSearchTab />,
        },
        {
          id: 'friendRequest',
          label: 'Friend Requests',
          content: <ProfileFriendRequestTab />,
        },
      ]
    : []),
    {
      id: 'friends',
      label: 'Friends',
      content: <ProfileFriendsTab />,
    },
  ...(!ownedProfile
    ? [
        {
          id: 'mutalFriends',
          label: 'Mutual Friends',
          content: <ProfileFriendMutalsTab />,
        }
      ]
    : []),
];

  const profileTabData: TabItem[] = [
    {
      id: 'about',
      label: ownedProfile ? 'Profile' : 'About',
      content: profileUser && (ownedProfile
        ? <MyProfileAboutTab profileUser={profileUser} />
        : <TheirProfileAboutTab profileUser={profileUser} />
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <ProfileSettingsTab />,
    },
  ];

  return (
    <Container TwClassName='min-h-[calc(100vh-50px)] w-full flex-col'>
      {isProfileLoading ? (
        <Container TwClassName="h-full w-full flex-col justify-center items-center">
          <Loader variant="spinner" color="bg-amber-500" />
        </Container>
      ) : profileUser ? (
        <Container TwClassName='relative flex-col'>
          <TrianglifyBanner
            xColors={profileUser.trianglifyObject.xColors}
            yColors={profileUser.trianglifyObject.yColors}
            width="w-full" 
            height={250}
            variance={profileUser.trianglifyObject.variance}
            cellSize={profileUser.trianglifyObject.cellSize}
            auxImage={profileUser.trianglifyObject.auxImage}
          />
          {userIdFromUrl === authUser?.userId && (
            <Container TwClassName='absolute top-[200px] right-[5px]'>
              <Button
                cursor='pointer' 
                TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-amber-500 hover:bg-gray-400 hover:border-primary p-2'
                onClick={openTrianglifyModal}
              >
                <Icon color="text-gray-900"
                  name='Edit'
                  
                />
              </Button>
            </Container>
          )}
          <Container
            TwClassName='flex-col relative md:flex-row'
          >
            <Container
              TwClassName="flex-col flex-[3] relative min-w-[240px]"
            >
              <Container
                TwClassName="p-4 md:p-8 absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 z-10"
              >
                {userIdFromUrl === authUser?.userId && (
                  <Container TwClassName='absolute bottom-8 right-8'>
                    <Button
                      cursor='pointer' 
                      TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-amber-500 hover:bg-gray-400 hover:border-primary p-2'
                      onClick={openProfilePictureModal}
                    >
                      <Icon color="text-gray-900"
                        name='Camera'
                        
                      />
                    </Button>
                  </Container>
                )}
                {profileUser?.profileImage ? (
                  <Image
                    src={profileUser.profileImage}
                    alt="User Avatar"
                    width={160}
                    height={160}
                    TwClassName="rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <Container
                    TwClassName="w-[160px] h-[160px] rounded-full bg-gray-900 cursor-pointer flex justify-center items-center border-4 border-white shadow-lg"
                  >
                    <Text
                      TwClassName="text-gray-50 font-primary text-4xl w-full flex justify-center items-center"
                      text={`${profileUser.firstName?.[0] || ''}${profileUser.lastName?.[0] || ''}`.toUpperCase()}
                    />
                  </Container>
                )}
              </Container>

              <Container TwClassName="h-[80px] flex-row justify-end items-end">
                <span></span>
              </Container>

              <Container TwClassName="flex-col p-4 md:p-8 relative">                
                <Text
                  TwClassName="text-gray-900 text-xl font-bold"
                  text={`${profileUser.firstName?.charAt(0).toUpperCase() || ''}${profileUser.firstName?.slice(1) || ''} ${profileUser.lastName?.charAt(0).toUpperCase() || ''}${profileUser.lastName?.slice(1) || ''}`}
                />
                <Text TwClassName="text-gray-900 text-md" text={profileUser.email} />
                <Text
                  text={`Member since: ${format(profileUser.createdAt, 'EEEE, MMMM do, yyyy')}`}
                  TwClassName="text-xs text-gray-500"
                />     
                {profileUser.bio && (
                  <Text
                    text={profileUser.bio}
                    TwClassName="text-md text-gray-900 mt-3"
                  />
                )}   
                {profileUser && <FriendProfileModule profileUser={profileUser} />}
                
              </Container>
              <Container TwClassName="flex-col p-4 md:pr-8 md:pb-8 md:pl-8 md:pt-0 relative">
                <Button
                  onClick={() => setActiveProfileSection('Main')}
                  TwClassName={
                      "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-gray-900 border border-gray-200 hover:bg-transparent flex justify-center items-center"
                  }>
                    <span className="absolute left-3">
                        <Icon color="text-gray-900" name="House" />
                    </span>
                    Home
                </Button>
                <Button
                  onClick={() => setActiveProfileSection('Friends')}
                  TwClassName={
                      "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-gray-900 border border-gray-200 hover:bg-transparent flex justify-center items-center"
                  }>
                    <span className="absolute left-3">
                        <Icon color="text-gray-900" name="ContactRound" />
                    </span>
                    Friends
                </Button>
                {ownedProfile && (
                  <Button
                    onClick={() => setActiveProfileSection('Profile')}
                    TwClassName={
                        "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-gray-900 border border-gray-200 hover:bg-transparent flex justify-center items-center"
                    }>
                      <span className="absolute left-3">
                          <Icon color="text-gray-900" name="User" />
                      </span>
                      Profile
                  </Button>
                )}
              </Container>
            </Container>

            <Container TwClassName="flex-col flex-[9] p-4 md:p-8">
              <Container TwClassName="h-[80px] flex-row justify-end items-end hidden md:flex">
                <span></span>
              </Container>
              {activeProfileSection === 'Main' && (
                <Tabs
                  tabs={mainTabData}
                  tabGroupId="profileMainTabs"
                />
              )}
              {activeProfileSection === 'Friends' && (
                <Tabs
                  tabs={friendTabData}
                  tabGroupId="profileFriendsTabs"
                />
              )}
              {activeProfileSection === 'Profile' && (
                <Tabs
                  tabs={profileTabData}
                  tabGroupId="profileSettingsTabs"
                />
              )}
            </Container>
          </Container>
        </Container>
      ) : (
        <Container
          TwClassName="flex-col h-full w-full justify-center items-center"
        >
          <Text
            text="We are sorry there is no profile with that user ID."
            TwClassName="text-xl text-gray-900"
          />
        </Container>
      )}
    </Container>
  );
};

export default Profile;