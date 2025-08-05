import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import type { Friend, FriendProfileModuleState } from "./friendTypes";
import { useNavigationHook } from "../../../hooks/useNavigationHook";
import { useAppSelector } from "../../../app/hooks";
import type { ClientAuthUser } from "../auth/ClientAuthUserTypes";
import { getDocumentById } from "../../../services/database/readData";
import { useFriendActions } from "../../hooks/useFriendActions";
import Container from "../../../shared/components/container/Container";
import Button from "../../../shared/components/button/Button";
import Icon from "../../../shared/components/icon/Icon";
import Loader from "../../../shared/components/loader/Loader";
import Text from "../../../shared/components/text/Text";
import Image from "../../../shared/components/image/Image";

const FriendProfileModule: React.FC<FriendProfileModuleState> = ({profileUser}) => { 
  const clientNavigation = useNavigationHook();
  const { userIdFromUrl } = useParams();
  const authUser = useAppSelector((state) => state.authUser.user);
  const friends = useAppSelector((state) => state.friends);
  const {loading, id} = useAppSelector((state) => state.loading);
  const [ownedProfile, setOwnedProfile] = useState<boolean>(true);
  const friendRemoval = loading && id === 'addFriend';
  const friendAddition = loading && id === 'remFriend';
  const [randomFriends, setRandomFriends] = useState<ClientAuthUser[]>([])
  
  function getRandomFriendIds(
    friends: Friend[],
    count: number = 5
  ): string[] {
    const friendIds = friends.map((f) =>
      f.requesterId === authUser?.userId ? f.requesteeId : f.requesterId
    );
    const shuffled = [...friendIds].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  useEffect(() => {
    async function fetchRandomFriends() {
      const fiveFriendIds = getRandomFriendIds(friends.friends, 5);
  
      try {
        const friendDocs = await Promise.all(
          fiveFriendIds.map((id) => getDocumentById("Users", id))
        );
        
        const validFriends = friendDocs.filter((doc): doc is ClientAuthUser => Boolean(doc));
        
        setRandomFriends(validFriends);
      } catch (err) {
        console.error("Error fetching random friends:", err);
      }
    }
  
    if (friends.friends.length) {
      fetchRandomFriends();
    }
  }, [friends.friends]);

  useEffect(()=>{
    if (authUser?.userId === userIdFromUrl) {
      setOwnedProfile(true)
    } else {
      setOwnedProfile(false)
    }
  }, [userIdFromUrl, authUser?.userId])
  
  const acceptedRequest = friends.friends.find(
    (req) =>
      req.requesteeId === userIdFromUrl ||
      req.requesterId === userIdFromUrl &&
      req.status === "accepted"
  );
  
  const isAcceptedRequest = Boolean(acceptedRequest);

  const sentRequest = friends.sentRequests.find(
    (req) =>
      req.requesteeId === userIdFromUrl &&
      req.requesterId === authUser?.userId &&
      req.status === "pending"
  );
  
  const isSentRequest = Boolean(sentRequest);

  const receivedRequest = friends.requests.find(
    (req) =>
      req.requesterId === userIdFromUrl &&
      req.requesteeId === authUser?.userId &&
      req.status === "pending"
  );
  
  const isRecievedRequest = Boolean(receivedRequest);

  const isValidDate = (d?: string | Date) =>
  !!d && !isNaN(new Date(d).getTime());

  const validReceivedCreatedAt = isValidDate(receivedRequest?.createdAt);
  const validSentCreatedAt = isValidDate(sentRequest?.createdAt);

  const {
    acceptFriend,
    removeFriend,
    addFriend,
  } = useFriendActions({
    userIdFromUrl: userIdFromUrl!,
    receivedRequestId: receivedRequest?.id,
    sentRequestId: sentRequest?.id,
    acceptedRequestId: acceptedRequest?.id,
    isAcceptedRequest,
  });

  return (
    <Container TwClassName="h-full w-full flex-col">
      {!ownedProfile ? (
        <Container TwClassName="flex-col">
          {isSentRequest && 
            <Button
              onClick={removeFriend} TwClassName={
                !isSentRequest ? "relative flex-1 mt-3 p-1 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center"
                : "relative flex-1 mt-3 p-1 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center"
            }>
              <span className="absolute left-3">
                  <Icon name="UserMinus" />
              </span>
              {friendRemoval ? <Loader variant="spinner" color="bg-primary" /> : 'Rescind'}
            </Button>
          }
          {isRecievedRequest && 
            <Container TwClassName="flex-col">
                <Button
                  onClick={removeFriend} TwClassName={
                    "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center"
                }>
                  <span className="absolute left-3">
                      <Icon name="UserMinus" />
                  </span>
                  {friendRemoval ? <Loader variant="spinner" color="bg-primary" /> : 'Decline'}
                </Button>
                <Button
                  onClick={acceptFriend} TwClassName={
                      "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center"
                  }>
                    <span className="absolute left-3">
                        <Icon name="UserPlus" />
                    </span>
                    {friendRemoval ? <Loader variant="spinner" color="bg-primary" /> : 'Accept'}
                </Button>
              
              {receivedRequest && validReceivedCreatedAt && profileUser?.firstName && (
                <Text
                  TwClassName="text-xs text-gray-500 mt-2"
                  text={`${profileUser.firstName} invited you to be friends on: ${format(
                    new Date(receivedRequest.createdAt),
                    "EEEE, MMMM do, yyyy"
                  )}`}
                />
              )}
            </Container>
          }
          {!isRecievedRequest && !isAcceptedRequest &&
            <Button 
              disabled={isSentRequest}
              onClick={addFriend} TwClassName={
                !isSentRequest ? "relative flex-1 mt-3 p-1 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center"
                : "relative flex-1 mt-3 p-1 bg-gray-300 rounded-xl text-black border border-gray-300 hover:bg-transparent flex justify-center items-center"
            }>
              <span className="absolute left-3">
                  <Icon name="UserPlus" />
              </span>
              {friendAddition ? <Loader variant="spinner" color="bg-primary" /> : (!isSentRequest ? 'Add Friend' : 'Pending')}
            </Button>
          }
          {sentRequest && validSentCreatedAt && profileUser?.firstName && (
            <Text
              TwClassName="text-xs text-gray-500 mt-2"
              text={`You invited ${profileUser.firstName} to be friends on: ${format(
                new Date(sentRequest.createdAt),
                "EEEE, MMMM do, yyyy"
              )}`}
            />
          )}
          {isAcceptedRequest && 
            <Container TwClassName="flex-col">
              <Button
                onClick={removeFriend} TwClassName={
                  "relative flex-1 mt-3 pt-1 pr-3 pb-1 pl-3 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center"
              }>
                <span className="absolute left-3">
                    <Icon name="UserMinus" />
                </span>
                {friendRemoval ? <Loader variant="spinner" color="bg-primary" /> : 'Unfriend'}
              </Button>
              {acceptedRequest && profileUser?.firstName && (
                <Text
                  TwClassName="text-xs text-gray-500 mt-2"
                  text={`You've been friends with ${profileUser.firstName} since: ${format(
                    new Date(acceptedRequest.createdAt),
                    "EEEE, MMMM do, yyyy"
                  )}`}
                />
              )}
            </Container>
          }
        </Container>
      ) : (
        <Container TwClassName="flex-col">
          <Text
            text={
              friends.friends.length >= 0
                ? `${friends.friends.length === 1 ? "1 Friend:" : friends.friends.length + " Friends:"}`
                : "Friends:"
            }
            TwClassName="text-black text-xl font-bold mt-5"
          />
          <Container TwClassName="flex-row">
            {randomFriends.map((friend) => (
              <Container onClick={() => clientNavigation(`/profile/${friend.userId}`, 'Profile', '')()}>
                {friend.profileImage ? (
                  <Image
                    key={friend.userId}
                    src={friend.profileImage}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    TwClassName="-ml-1.5 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
                  />
                ) : (
                  <Container
                    key={friend.userId}
                    TwClassName="-ml-1.5 rounded-full w-7 h-7 bg-black cursor-pointer flex justify-center items-center border-3 border-white"
                  >
                    <Text
                      TwClassName="text-white w-full text-xs font-semibold leading-[2.5rem] text-center"
                      text={`${friend.firstName?.[0] || ''}${friend.lastName?.[0] || ''}`.toUpperCase()}
                    />
                  </Container>
                )}
              </Container>
            ))}
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default FriendProfileModule;