import React, { useEffect, useState, useMemo } from 'react';
import Container from '../../../../shared/components/container/Container';
import { useAppSelector } from '../../../../app/hooks';
import { getDocumentById } from '../../../../services/database/readData';
import type { Friend } from '../friendTypes';
import type { ClientAuthUser } from '../../auth/ClientAuthUserTypes';
import { useParams } from 'react-router-dom';
import Text from '../../../../shared/components/text/Text';
import FriendCard, { type FriendStatus } from '../components/FriendCard';
import Pagination from '../../../../shared/components/pagination/Pagination';

const FRIENDS_PER_PAGE = 6;

type FriendData = { 
  friend: ClientAuthUser; 
  meta: Friend & { source: FriendStatus } 
};

const ProfileFriendsTab: React.FC = () => {
  const { userIdFromUrl } = useParams<{ userIdFromUrl: string }>();
  const profileFriends = useAppSelector((state) => state.theirFriends.friends) as Friend[];
  const { loading, id } = useAppSelector((state) => state.loading);
  const authUser = useAppSelector((state) => state.authUser.user);
  
  const [friendsData, setFriendsData] = useState<FriendData[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const friendRemoval = loading && id === 'remFriend';
  
  const isOwnProfile = useMemo(() => 
    authUser?.userId === userIdFromUrl, 
    [authUser?.userId, userIdFromUrl]
  );

  const totalPages = Math.ceil(profileFriends.length / FRIENDS_PER_PAGE);

  const fetchFriendsData = async (pageNum: number) => {
    if (!authUser || !userIdFromUrl || profileFriends.length === 0) {
      setFriendsData([]);
      return;
    }

    setIsLoading(true);

    try {
      const startIdx = pageNum * FRIENDS_PER_PAGE;
      const endIdx = startIdx + FRIENDS_PER_PAGE;
      const currentPageFriends = profileFriends.slice(startIdx, endIdx);

      const results = await Promise.all(
        currentPageFriends.map(async (friend): Promise<FriendData | null> => {
          try {
            const friendId = friend.requesteeId === userIdFromUrl
              ? friend.requesterId
              : friend.requesteeId;

            const user = await getDocumentById<ClientAuthUser>('Users', friendId);
            return user ? { 
              friend: user, 
              meta: { ...friend, source: 'accepted' as const } 
            } : null;
          } catch (error) {
            console.error('Error fetching friend data:', error);
            return null;
          }
        })
      );

      setFriendsData(results.filter(Boolean) as FriendData[]);
    } catch (error) {
      console.error('Error fetching friends data:', error);
      setFriendsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData(page);
  }, [authUser, profileFriends, page, userIdFromUrl]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFriendAction = (action: string, friendId: string) => {
    console.log(`Action ${action} performed on friend ${friendId}`);
    // Optionally refresh data after action
    // fetchFriendsData(page);
  };

  const getEmptyStateMessage = () => {
    return isOwnProfile 
      ? 'You do not currently have any friends'
      : 'This user does not currently have any friends';
  };

  if (isLoading) {
    return (
      <Container TwClassName="flex-col items-center justify-center py-8">
        <Text text="Loading friends..." TwClassName="text-center" />
      </Container>
    );
  }

  return (
    <Container TwClassName="flex-col">
      <Container TwClassName="flex-row gap-3 w-full flex-wrap">
        {friendsData.map(({ friend, meta }) => (
          <FriendCard
            key={friend.userId}
            friend={friend}
            meta={meta}
            isLoading={friendRemoval}
            onAction={handleFriendAction}
          />
        ))}
      </Container>

      {friendsData.length > 0 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <Text 
          text={getEmptyStateMessage()} 
          TwClassName="text-center w-full mt-6" 
        />
      )}
    </Container>
  );
};

export default ProfileFriendsTab;