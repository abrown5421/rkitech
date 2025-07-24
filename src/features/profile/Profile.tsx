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

const Profile: React.FC = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'profile';

  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        dispatch(setLoading({ loading: true, id: 'profile' }));

        const data = await getDocumentById('Users', userId);
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
  }, [userId, dispatch]);

  return (
    <Container height="h-full" width="w-full" flexDirection="col">
      {isLoading ? (
        <Loader variant="spinner" color="bg-primary" />
      ) : profileUser ? (
        <>
          <TrianglifyBanner
            xColors={["#FF5733", "#FFC300"]}
            yColors={["#DAF7A6", "#900C3F"]}
            width="w-full" 
            height={300}
            variance={0.6}
            cellSize={90}
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

              <div style={{ height: 80 }} />

              <Container flexDirection="col" padding='xl'>
                <Text
                  color="text-black"
                  size="2x"
                  bold
                  text={profileUser.firstName + ' ' + profileUser.lastName}
                />
                <Text color="text-black" size="xl" text={profileUser.email} />
                <Text
                  text={`Member since: ${format(profileUser.createdAt, 'EEEE, MMMM do, yyyy')}`}
                  size="sm"
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
