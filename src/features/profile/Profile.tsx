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
import { format } from 'date-fns';
import Button from '../../shared/components/button/Button';
import Icon from '../../shared/components/icon/Icon';
import { openModal } from '../modal/modalSlice';
import TrianglifyBanner from '../../shared/components/trianglifyBanner/TrianglifyBanner';
import FriendProfileModule from '../friends/FriendProfileModule';
import Tabs from '../tabs/Tabs';
import type { TabItem } from '../tabs/tabTypes';
import MyProfileAboutTab from '../tabs/tabContent/profileTabs/MyProfileAboutTab';
import ProfileFriendSearchTab from '../tabs/tabContent/friendTabs/ProfileFriendSearchTab';
import { TheirProfileAboutTab } from '../tabs/tabContent/profileTabs/TheirProfileAboutTab';
import ProfileSettingsTab from '../tabs/tabContent/profileTabs/ProfileSettingsTab';
import ProfileMainTab from '../tabs/tabContent/mainTabs/ProfileMainTab';
import ProfileFriendRequestTab from '../tabs/tabContent/friendTabs/ProfileFriendRequestTab';
import ProfileFriendsTab from '../tabs/tabContent/friendTabs/ProfileFriendsTab';
import ProfileFriendMutalsTab from '../tabs/tabContent/friendTabs/ProfileFriendMutalsTab';

const Profile: React.FC = () => {
  const { userIdFromUrl } = useParams();
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const authUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = loading && id === 'profile';
  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);
  const [activeProfileSection, setActiveProfileSection] = useState<string>('Main');
  const ownedProfile = authUser?.userId === userIdFromUrl;

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
            setProfileUser({ ...(data as AuthUser), userId: userIdFromUrl });
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

  const handleProfilePictureEditModal = () => {
    if (!profileUser) return;

    dispatch(
      openModal({
        title: 'Edit Profile Picture',
        modalType: 'editProfilePic',
      })
    );
  };

  const handleProfileBannerEditModal = () => {
    if (!profileUser) return;

    dispatch(
      openModal({
        title: 'Edit Profile',
        modalType: 'editProfileBanner',
        modalProps: {
          yColors: profileUser.trianglifyObject.yColors,
          xColors: profileUser.trianglifyObject.xColors,
          auxImage: profileUser.trianglifyObject.auxImage,
          cellSize: profileUser.trianglifyObject.cellSize,
          variance: profileUser.trianglifyObject.variance
        },
      })
    );

  }

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
          <Loader variant="spinner" color="bg-primary" />
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
                TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-primary hover:bg-gray-400 hover:border-primary p-2'
                onClick={handleProfileBannerEditModal}
              >
                <Icon
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
                      TwClassName='rounded-full border-1 bg-gray-200 border-gray-200 hover:text-primary hover:bg-gray-400 hover:border-primary p-2'
                      onClick={handleProfilePictureEditModal}
                    >
                      <Icon
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

              <Container TwClassName="flex-col p-4 md:p-8 relative">                
                <Text
                  TwClassName="text-black text-xl font-bold"
                  text={`${profileUser.firstName?.charAt(0).toUpperCase() || ''}${profileUser.firstName?.slice(1) || ''} ${profileUser.lastName?.charAt(0).toUpperCase() || ''}${profileUser.lastName?.slice(1) || ''}`}
                />
                <Text TwClassName="text-black text-md" text={profileUser.email} />
                <Text
                  text={`Member since: ${format(profileUser.createdAt, 'EEEE, MMMM do, yyyy')}`}
                  TwClassName="text-xs text-gray-500"
                />     
                {profileUser.bio && (
                  <Text
                    text={profileUser.bio}
                    TwClassName="text-md text-black mt-3"
                  />
                )}   
                {profileUser && <FriendProfileModule profileUser={profileUser} />}
                
              </Container>
              <Container TwClassName="flex-col p-4 md:p-8 relative">
                <Button
                  onClick={() => setActiveProfileSection('Main')}
                  TwClassName={
                      "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:bg-transparent flex justify-center items-center"
                  }>
                    <span className="absolute left-3">
                        <Icon name="House" />
                    </span>
                    Home
                </Button>
                <Button
                  onClick={() => setActiveProfileSection('Friends')}
                  TwClassName={
                      "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:bg-transparent flex justify-center items-center"
                  }>
                    <span className="absolute left-3">
                        <Icon name="ContactRound" />
                    </span>
                    Friends
                </Button>
                {ownedProfile && (
                  <Button
                    onClick={() => setActiveProfileSection('Profile')}
                    TwClassName={
                        "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:bg-transparent flex justify-center items-center"
                    }>
                      <span className="absolute left-3">
                          <Icon name="User" />
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
            TwClassName="text-xl text-black"
          />
        </Container>
      )}
    </Container>
  );
};

export default Profile;