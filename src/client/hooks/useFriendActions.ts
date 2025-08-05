import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { insertDataIntoCollection } from "../../services/database/createData";
import { deleteDocument } from "../../services/database/deleteData";
import { updateDataInCollection } from "../../services/database/updateData";
import { setLoading, setNotLoading } from "../../app/globalSlices/loading/loadingSlice";
import { openAlert } from "../../shared/features/alert/alertSlice";

interface UseFriendActionsParams {
  userIdFromUrl: string;
  receivedRequestId?: string;
  sentRequestId?: string;
  acceptedRequestId?: string;
  isAcceptedRequest: boolean;
}

interface AlertConfig {
  severity: 'success' | 'error';
  message: string;
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

  const showAlert = useCallback((config: AlertConfig) => {
    dispatch(
      openAlert({
        alertOpen: true,
        alertSeverity: config.severity,
        alertMessage: config.message,
        alertAnimation: {
          entranceAnimation: "animate__fadeInRight animate__faster",
          exitAnimation: "animate__fadeOutRight animate__faster",
          isEntering: true,
        },
      })
    );
  }, [dispatch]);

  const executeWithLoading = useCallback(async (
    loadingId: string,
    operation: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    dispatch(setLoading({ loading: true, id: loadingId }));
    
    try {
      await operation();
      showAlert({ severity: 'success', message: successMessage });
    } catch (error) {
      console.error(`Error in ${loadingId}:`, error);
      showAlert({ severity: 'error', message: errorMessage });
    } finally {
      dispatch(setNotLoading());
    }
  }, [dispatch, showAlert]);

  const acceptFriend = useCallback(async () => {
    if (!receivedRequestId) {
      showAlert({ severity: 'error', message: 'No received request ID found.' });
      return;
    }

    await executeWithLoading(
      'addFriend',
      async () => {
        await updateDataInCollection("Friends", receivedRequestId, {
          status: "accepted",
          acceptedAt: new Date().toISOString(),
        });
      },
      'You are now friends!',
      'Failed to accept friend request. Try again.'
    );
  }, [receivedRequestId, executeWithLoading, showAlert]);

  const removeFriend = useCallback(async () => {
    const requestId = sentRequestId || receivedRequestId || acceptedRequestId;
    
    if (!requestId) {
      showAlert({ severity: 'error', message: 'No request ID found to remove.' });
      return;
    }

    const successMessage = isAcceptedRequest 
      ? 'Friend removed successfully.' 
      : 'Friend request removed.';

    await executeWithLoading(
      'remFriend',
      async () => {
        await deleteDocument("Friends", requestId);
      },
      successMessage,
      'Failed to remove friend. Try again.'
    );
  }, [sentRequestId, receivedRequestId, acceptedRequestId, isAcceptedRequest, executeWithLoading, showAlert]);

  const addFriend = useCallback(async () => {
    if (!authUser?.userId) {
      showAlert({ severity: 'error', message: 'User not authenticated.' });
      return;
    }

    const newRelationship = {
      requesterId: authUser.userId,
      requesteeId: userIdFromUrl,
      status: "pending",
      seenByRequestee: false,
      createdAt: new Date().toISOString(),
      acceptedAt: "",
    };

    const requestNotif = {
      senderUserId: authUser.userId,
      recieverUserId: userIdFromUrl,
      type: "friend_request",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    await executeWithLoading(
      'addFriend',
      async () => {
        await Promise.all([
          insertDataIntoCollection("Notifications", requestNotif),
          insertDataIntoCollection("Friends", newRelationship)
        ]);
      },
      'Friend request sent!',
      'Failed to send friend request. Try again.'
    );
  }, [authUser?.userId, userIdFromUrl, executeWithLoading, showAlert]);

  return { 
    acceptFriend, 
    removeFriend, 
    addFriend,
    isLoading: (id: string) => {
      const loading = useAppSelector((state) => state.loading);
      return loading.loading && loading.id === id;
    }
  };
}