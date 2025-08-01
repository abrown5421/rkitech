import React, { useEffect, useState } from "react";
import Container from "../../shared/components/container/Container";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../shared/components/button/Button";
import Icon from "../../shared/components/icon/Icon";
import Loader from "../../shared/components/loader/Loader";
import { insertDataIntoCollection } from "../../services/database/createData";
import { setLoading, setNotLoading } from "../../app/globalSlices/loading/loadingSlice";
import { openAlert } from "../alert/alertSlice";
import Text from "../../shared/components/text/Text";
import { format } from "date-fns";
import type { FriendProfileModuleState } from "./friendTypes";
import { deleteDocument } from "../../services/database/deleteData";
import { updateDataInCollection } from "../../services/database/updateData";

const FriendProfileModule: React.FC<FriendProfileModuleState> = ({profileUser}) => { 
  const dispatch = useAppDispatch();
  const { userIdFromUrl } = useParams();
  const authUser = useAppSelector((state) => state.authUser.user);
  const friends = useAppSelector((state) => state.friends);
  const {loading, id} = useAppSelector((state) => state.loading);
  const [ownedProfile, setOwnedProfile] = useState<boolean>(true);
  const friendRemoval = loading && id === 'addFriend';
  const friendAddition = loading && id === 'remFriend';

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
  const validAcceptededAt = isValidDate(acceptedRequest?.acceptedAt);

  const acceptFriend = async () => {
    dispatch(setLoading({ loading: true, id: "addFriend" }));
    try {
      await updateDataInCollection("Friends", receivedRequest?.id!, {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      });
  
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage: "You are now friends!",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Failed to accept friend request. Try again.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } finally {
      dispatch(setNotLoading());
    }
  };

  const removeFriend = async () => {
    dispatch(setLoading({ loading: true, id: "remFriend" }));
    try {
      const requestId =
        sentRequest?.id || receivedRequest?.id || acceptedRequest?.id;
  
      if (!requestId) return;
  
      await deleteDocument("Friends", requestId);
  
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage: isAcceptedRequest
            ? "Friend removed successfully."
            : "Friend request removed.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } catch (error) {
      console.error("Error removing friend:", error);
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Failed to remove friend. Try again.",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } finally {
      dispatch(setNotLoading());
    }
  };

  const addFriend = async () => {
    dispatch(setLoading({loading: true, id: 'addFriend'}))
    const newRelationship = {
      requesterId: authUser?.userId,
      requesteeId: userIdFromUrl,
      status: 'pending',
      seenByRequestee: false,
      createdAt: new Date().toISOString(),
      acceptedAt: ''
    }
    try {
      await insertDataIntoCollection('Friends', newRelationship)

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Friend request sent!',
        alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
        }
      }));
    } catch {
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Friend request sent!',
        alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
        }
      }));
    } finally {
      dispatch(setNotLoading())
    }
  }

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
                : "relative flex-1 mt-3 p-1 bg-gray-300 rounded-xl text-white border border-gray-300 hover:bg-transparent hover:text-gray-300 flex justify-center items-center"
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
              {acceptedRequest && validAcceptededAt && profileUser?.firstName && (
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
      ) : 'friend list'}
    </Container>
  );
};

export default FriendProfileModule;
