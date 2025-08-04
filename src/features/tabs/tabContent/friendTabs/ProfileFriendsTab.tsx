
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

const FRIENDS_PER_PAGE = 6;

const ProfileFriendsTab: React.FC = () => {
  const { userIdFromUrl } = useParams();
  const profileFriends = useAppSelector((state) => state.theirFriends.friends) as Friend[];
  const authUser = useAppSelector((state) => state.authUser.user);
  const [friendsData, setFriendsData] = useState<AuthUser[]>([]);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(profileFriends.length / FRIENDS_PER_PAGE);

  useEffect(() => {
    const fetchFriends = async () => {
      const startIdx = page * FRIENDS_PER_PAGE;
      const endIdx = startIdx + FRIENDS_PER_PAGE;
      const currentPageFriends = profileFriends.slice(startIdx, endIdx);

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

    if (authUser && profileFriends.length > 0) {
      fetchFriends();
    }
  }, [authUser, profileFriends, page, userIdFromUrl]);

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
            TwClassName="flex-row w-[calc(50%-0.5rem)] box-border border border-gray-300 rounded-xl p-4"
          >
            <Container TwClassName='flex-col justify-center'>
              {friend.profileImage ? (
                <Image
                  src={friend.profileImage}
                  alt="User Avatar"
                  TwClassName="w-15 h-15 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                />
              ) : (
                <Container
                  TwClassName="-ml-1.5 rounded-full w-15 h-15 bg-black cursor-pointer flex justify-center items-center border-3 border-white"
                >
                  <Text
                    TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                    text={`${friend.firstName?.[0] || ''}${friend.lastName?.[0] || ''}`.toUpperCase()}
                  />
                </Container>
              )}
            </Container>
            <Container TwClassName='flex-col w-full pl-4'>
              <Container TwClassName='flex-row w-full justify-between'>
                <span>{friend.firstName} {friend.lastName}</span>
                <span>
                  {friend.userId === authUser?.userId && (
                    <Text text='(You)' TwClassName='text-primary font-bold' />
                  )}
                </span>
              </Container>
              <Container TwClassName='flex-row'>{friend.email}</Container>
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

export default ProfileFriendsTab;
