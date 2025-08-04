import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { insertDataIntoCollection } from "../services/database/createData";
import { deleteDocument } from "../services/database/deleteData";
import { updateDataInCollection } from "../services/database/updateData";
import { setLoading, setNotLoading } from "../app/globalSlices/loading/loadingSlice";
import { openAlert } from "../features/alert/alertSlice";

interface UseFriendActionsParams {
  userIdFromUrl: string;
  receivedRequestId?: string;
  sentRequestId?: string;
  acceptedRequestId?: string;
  isAcceptedRequest: boolean;
}

export function useFriendActions({
  userIdFromUrl,
  receivedRequestId,
  sentRequestId,
  acceptedRequestId,
  isAcceptedRequest,
}: UseFriendActionsParams) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser.user);

  const acceptFriend = useCallback(async () => {
    dispatch(setLoading({ loading: true, id: "addFriend" }));
    try {
      if (!receivedRequestId) throw new Error("No received request ID");

      await updateDataInCollection("Friends", receivedRequestId, {
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
  }, [dispatch, receivedRequestId]);

  const removeFriend = useCallback(async () => {
    dispatch(setLoading({ loading: true, id: "remFriend" }));
    try {
      const requestId = sentRequestId || receivedRequestId || acceptedRequestId;
      if (!requestId) throw new Error("No request ID to remove");

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
  }, [dispatch, sentRequestId, receivedRequestId, acceptedRequestId, isAcceptedRequest]);

  const addFriend = useCallback(async () => {
    dispatch(setLoading({ loading: true, id: "addFriend" }));

    const newRelationship = {
      requesterId: authUser?.userId,
      requesteeId: userIdFromUrl,
      status: "pending",
      seenByRequestee: false,
      createdAt: new Date().toISOString(),
      acceptedAt: "",
    };

    const requestNotif = {
      userId: userIdFromUrl,
      type: "friend_request",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await insertDataIntoCollection("Notifications", requestNotif);
      await insertDataIntoCollection("Friends", newRelationship);

      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "success",
          alertMessage: "Friend request sent!",
          alertAnimation: {
            entranceAnimation: "animate__fadeInRight animate__faster",
            exitAnimation: "animate__fadeOutRight animate__faster",
            isEntering: true,
          },
        })
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
      dispatch(
        openAlert({
          alertOpen: true,
          alertSeverity: "error",
          alertMessage: "Failed to send friend request. Try again.",
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
  }, [dispatch, authUser?.userId, userIdFromUrl]);

  return { acceptFriend, removeFriend, addFriend };
}