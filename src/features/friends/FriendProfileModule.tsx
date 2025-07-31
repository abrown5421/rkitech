import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../shared/components/container/Container';
import { useParams } from 'react-router-dom';
import { getDocumentById } from '../../services/database/readData';
import type { AuthUser } from '../auth/authUserTypes';
import Loader from '../../shared/components/loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLoading, setNotLoading } from '../../app/globalSlices/loading/loadingSlice';
import Text from '../../shared/components/text/Text';
import Image from '../../shared/components/image/Image';
import Button from '../../shared/components/button/Button';
import Icon from '../../shared/components/icon/Icon';
import { appendToArrayInCollection, removeFromArrayByCondition } from '../../services/database/updateData';
import { openAlert } from '../alert/alertSlice';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import type { FriendProfileModuleProps } from './friendTypes';

const FriendProfileModule: React.FC<FriendProfileModuleProps> = ({ profileUser }) => {
  const clientNavigation = useNavigationHook();
  const { userIdFromUrl } = useParams();
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const authUser = useAppSelector((state) => state.authUser.user);
  const isAdding = loading && id === 'addFriend';
  const isRemoving = loading && id === 'remFriend';
  const isConfirming = loading && id === 'confirmFriend';
  const [friendAvatars, setFriendAvatars] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAvatars = async () => {
      if (!profileUser?.friends) return;

      const confirmedFriends = profileUser?.friends.filter(f => f.friends).slice(0, 5);
      const avatarPromises = confirmedFriends.map(async (friend) => {
        try {
          const data = await getDocumentById('Users', friend.friendId);

          if (!data) return null; 

          const typedData = data as AuthUser; 

          if (typedData.profileImage) {
            return { id: friend.friendId, avatar: typedData.profileImage };
          } else {
            const initials = `${typedData.firstName?.[0] || ''}${typedData.lastName?.[0] || ''}`.toUpperCase();
            return { id: friend.friendId, avatar: initials };
          }
        } catch (e) {
          console.error('Failed to fetch friend avatar:', e);
          return null;
        }
      });

      const avatars = await Promise.all(avatarPromises);
      const avatarMap: Record<string, string> = {};
      avatars.forEach(a => {
        if (a) avatarMap[a.id] = a.avatar;
      });

      setFriendAvatars(avatarMap);
    };

    fetchAvatars();
  }, [profileUser?.friends]);

  const friendRelation = useMemo(() => {
    if (!authUser?.friends || !userIdFromUrl) return null;

    return authUser.friends.find(friend =>
      (friend.requester === authUser.userId && friend.requestee === userIdFromUrl) ||
      (friend.requestee === authUser.userId && friend.requester === userIdFromUrl)
    );
  }, [authUser?.friends, userIdFromUrl]);

  useEffect(()=>{console.log(friendRelation)}, [friendRelation])

  const handleAddFriend = async () => {
    dispatch(setLoading({ loading: true, id: 'addFriend' }));
    if (!authUser?.userId || !userIdFromUrl) return;
    try {
      await appendToArrayInCollection('Users', authUser.userId, 'friends', {
        friends: false,
        requester: authUser.userId,
        requestee: userIdFromUrl,
        seen: true,
        friendId: userIdFromUrl
      });

      await appendToArrayInCollection('Users', userIdFromUrl, 'friends', {
        friends: false,
        requester: authUser.userId,
        requestee: userIdFromUrl,
        seen: false,
        friendId: authUser.userId
      });
      
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Friend request sent!',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } catch {
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Friend request failed.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } finally {
      dispatch(setNotLoading());
    }
  };


  const handleAcceptFriend = async () => {
    dispatch(setLoading({ loading: true, id: 'confirmFriend' }));
    if (!authUser?.userId || !userIdFromUrl) return;
    try {

      await removeFromArrayByCondition('Users', authUser.userId, 'friends', (item) => {
        return item.requester === userIdFromUrl && item.requestee === authUser.userId
      });

      await removeFromArrayByCondition('Users', userIdFromUrl, 'friends', (item) => {
        return item.requester === userIdFromUrl && item.requestee === authUser.userId
      });

      await appendToArrayInCollection('Users', authUser.userId, 'friends', {
        friends: true,
        requester: userIdFromUrl,
        requestee: authUser.userId,
        seen: true,
        friendId: userIdFromUrl,        
      });

      await appendToArrayInCollection('Users', userIdFromUrl, 'friends', {
        friends: true,
        requester: userIdFromUrl,
        requestee: authUser.userId,
        seen: true,
        friendId: authUser.userId
      });

    } catch (error) {
      console.error('Error accepting friend request:', error);
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Friend request acceptance failed.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } finally {
      dispatch(setNotLoading());
    }
  };

  const handleRemoveFriend = async () => {
    dispatch(setLoading({ loading: true, id: 'remFriend' }));
    if (!authUser?.userId || !userIdFromUrl) return;
    try {
      await removeFromArrayByCondition('Users', authUser.userId, 'friends', (item) => {
        return item.requester === authUser.userId && item.requestee === userIdFromUrl
      });

      await removeFromArrayByCondition('Users', userIdFromUrl, 'friends', (item) => {
        return item.requester === authUser.userId && item.requestee === userIdFromUrl
      });

    } catch {
      dispatch(setNotLoading());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Friend request denial failed.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } finally {
      dispatch(setNotLoading());
    }
  };
  
  return (
    <Container TwClassName="h-full w-full flex-col">
        {userIdFromUrl !== authUser?.userId && (
            <Container TwClassName='flex-row justify-between gap-2 mt-3'>
            {friendRelation === undefined && (
                <Button onClick={handleAddFriend} TwClassName="relative flex-1 mt-3 p-1 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserPlus" />
                </span>
                {isAdding ? <Loader variant="spinner" color="bg-primary" /> : <>Add Friend</>}
                </Button>
            )}

            {friendRelation?.friends && (
                <Button onClick={handleRemoveFriend} TwClassName="relative flex-1 mt-3 p-1 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserMinus" />
                </span>
                {isRemoving ? <Loader variant="spinner" color="bg-primary" /> : <>Unfriend</>}
                </Button>
            )}  

            {friendRelation?.friends && (
                <Button disabled onClick={handleRemoveFriend} TwClassName="relative flex-1 mt-3 p-1 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserCheck" />
                </span>
                {isRemoving ? <Loader variant="spinner" color="bg-primary" /> : <>Friends</>}
                </Button>
            )} 

            {!friendRelation?.friends && friendRelation?.requester === authUser?.userId && (
                <Button disabled TwClassName="relative flex-1 mt-3 p-1 bg-gray-200 rounded-xl text-gray-500 border border-gray-200 hover:bg-transparent hover:text-gray-200 flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserCog" />
                </span>
                {isAdding ? <Loader variant="spinner" color="bg-primary" /> : <>Pending</>}
                </Button>
            )}

            {friendRelation !== undefined && !friendRelation?.friends && friendRelation?.requester !== authUser?.userId && (
                <Button onClick={handleRemoveFriend} TwClassName="relative flex-1 mt-3 p-1 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserMinus" />
                </span>
                {isConfirming ? <Loader variant="spinner" color="bg-primary" /> : <>Decline</>}
                </Button>
            )}

            {friendRelation !== undefined && !friendRelation?.friends && friendRelation?.requester !== authUser?.userId && (
                <Button onClick={handleAcceptFriend} TwClassName="relative flex-1 mt-3 p-1 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center">
                <span className="absolute left-3">
                    <Icon name="UserPlus" />
                </span>
                {isConfirming ? <Loader variant="spinner" color="bg-primary" /> : <>Accept</>}
                </Button>
            )}
            
            </Container>
        )}

        <Text
            text={profileUser?.friends && profileUser?.friends.length > 0 ? (`${profileUser?.friends.length === 1 ? '1 Friend:' : profileUser?.friends.length + ' Friends:'}`) : 'Friends:'}
            TwClassName="text-black text-xl font-bold mt-5"
        />
        {profileUser?.friends && profileUser?.friends.length > 0 ? (
            <Container TwClassName="flex flex-row items-center relative">
            {profileUser?.friends
                .filter(friend => friend.friends)
                .slice(0, 5)
                .map((friend, index) => {
                const avatar = friendAvatars[friend.friendId];
                return (
                    <Container
                    key={friend.friendId}
                    TwClassName={`w-[40px] h-[40px] rounded-full cursor-pointer bg-black flex justify-center items-center border-3 border-white ${
                        index !== 0 ? '-ml-3' : ''
                    } z-${index * 10}`}
                    onClick={() => {
                        clientNavigation('/profile/' + friend.friendId, 'Profile', '5MMXnlLFK6gBQArZR3wW')()
                    }}
                    >
                    {avatar?.startsWith('http') ? (
                        <Image
                        src={avatar}
                        alt="User Avatar"
                        TwClassName="rounded-full w-full h-full object-cover"
                        />
                    ) : (
                        <Text
                        TwClassName="text-white font-primary text-xs w-full flex justify-center items-center"
                        text={avatar}
                        />
                    )}
                    </Container>
                );
                })}

            {profileUser?.friends.filter(friend => friend.friends).length > 5 && (
                <Container
                TwClassName="w-[40px] h-[40px] rounded-full bg-black text-white flex justify-center items-center font-primary -ml-3 z-50 border-3 border-white"
                >
                <Text
                    TwClassName="text-white font-primary text-xs w-full flex justify-center items-center"
                    text='...'
                />
                </Container>
            )}
            </Container>
        ) : (
            <Text
            text={
                userIdFromUrl === authUser?.userId
                ? 'You do not have any friends yet'
                : 'This user does not have any friends'
            }
            TwClassName="text-xs text-gray-500"
            />
        )}
              
    </Container>
  );
};

export default FriendProfileModule;