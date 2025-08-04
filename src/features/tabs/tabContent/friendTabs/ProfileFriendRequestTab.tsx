import React, { useEffect, useState } from 'react';
import Container from '../../../../shared/components/container/Container';
import { useAppSelector } from '../../../../app/hooks';
import { getDocumentById } from '../../../../services/database/readData';
import type { AuthUser } from '../../../auth/authUserTypes';
import type { Friend } from '../../../friends/friendTypes';
import { useParams } from 'react-router-dom';
import Image from '../../../../shared/components/image/Image';
import Text from '../../../../shared/components/text/Text';
import Button from '../../../../shared/components/button/Button';
import { format } from 'date-fns';
import Icon from '../../../../shared/components/icon/Icon';
import Loader from '../../../../shared/components/loader/Loader';

const FRIENDS_PER_PAGE = 6;

const ProfileFriendRequestTab: React.FC = () => {
  const { userIdFromUrl } = useParams();
  const profileRequestedFriends = useAppSelector((state) => state.theirFriends.sentRequests) as Friend[];
  const profileRequesteeFriends = useAppSelector((state) => state.theirFriends.requests) as Friend[];
  const {loading, id} = useAppSelector((state) => state.loading);
  const friendRemoval = loading && id === 'remFriend';
  const authUser = useAppSelector((state) => state.authUser.user);
  const [friendsData, setFriendsData] = useState<AuthUser[]>([]);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(profileRequestedFriends.length / FRIENDS_PER_PAGE);

  useEffect(() => {
    const fetchFriends = async () => {
      const startIdx = page * FRIENDS_PER_PAGE;
      const endIdx = startIdx + FRIENDS_PER_PAGE;
      const currentPageFriends = profileRequestedFriends.slice(startIdx, endIdx);

      const results = await Promise.all(
        currentPageFriends.map(async (friend) => {
          const friendId =
            friend.requesteeId === userIdFromUrl
              ? friend.requesterId
              : friend.requesteeId;

          return await getDocumentById<AuthUser>('Users', friendId);
        })
      );

      const filtered = results.filter((doc): doc is AuthUser => doc !== null);
      setFriendsData(filtered);
    };

    if (authUser && profileRequestedFriends.length > 0) {
      fetchFriends();
    }
  }, [authUser, profileRequestedFriends, page, userIdFromUrl]);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          aria-current={page === i ? 'page' : undefined}
          className={
            page === i
              ? 'z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md'
          }
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <Container TwClassName='flex-col'>
      <Container TwClassName='flex-row gap-3 w-full flex-wrap'>
        {friendsData.map((friend) => (
          <Container
            key={friend.userId}
            TwClassName="flex-col w-[calc(25%-0.5rem)] box-border border border-gray-300 rounded-xl p-4"
          >
            <Container
                TwClassName="flex-col w-full items-center justify-center"
            >
              {friend.profileImage ? (
                <Image
                  src={friend.profileImage}
                  alt="User Avatar"
                  TwClassName="w-20 h-20 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                />
              ) : (
                <Container
                  TwClassName="-ml-1.5 rounded-full w-20 h-20 bg-black cursor-pointer flex justify-center items-center border-3 border-white"
                >
                  <Text
                    TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                    text={`${friend.firstName?.[0] || ''}${friend.lastName?.[0] || ''}`.toUpperCase()}
                  />
                </Container>
              )}
              <Text
                TwClassName="text-black text-xl font-bold"
                text={`${friend.firstName?.charAt(0).toUpperCase() || ''}${friend.firstName?.slice(1) || ''} ${friend.lastName?.charAt(0).toUpperCase() || ''}${friend.lastName?.slice(1) || ''}`}
              />
              <Text TwClassName="text-black text-md" text={friend.email} />
              
              <Button
                TwClassName={
                    "w-full relative flex-1 mt-3 p-1 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon name="UserMinus" />
                </span>
                {friendRemoval ? <Loader variant="spinner" color="bg-primary" /> : 'Rescind'}
                </Button>
            </Container>              
          </Container>
        ))}
      </Container>

      <nav
        className="flex items-center justify-center mt-6 space-x-2"
        aria-label="Pagination"
      >
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          TwClassName={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
            page === 0 ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {renderPageNumbers()}

        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          TwClassName={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
            page >= totalPages - 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </nav>
    </Container>
  );
};

export default ProfileFriendRequestTab;

