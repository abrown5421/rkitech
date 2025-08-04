import { buildQuery } from "../services/database/queryBuilder";
import { listenToQuery } from "../services/database/listenForData";
import type { Friend } from "../features/friends/friendTypes";
import { clearProfileFriends, setProfileFriends } from "../features/friends/theirFriendSlice";
import type { AppDispatch } from "../app/store";

export const fetchProfileFriends = (profileUserId: string, dispatch: AppDispatch) => {
  const requesterQuery = buildQuery("Friends", [["requesterId", "==", profileUserId]]);
  const requesteeQuery = buildQuery("Friends", [["requesteeId", "==", profileUserId]]);

  let requesterFriends: Friend[] = [];
  let requesteeFriends: Friend[] = [];

  const handleMergeAndDispatch = () => {
    const merged = [...requesterFriends, ...requesteeFriends];
    dispatch(
      setProfileFriends({
        friends: merged.filter((f) => f.status === "accepted"),
        requests: merged.filter(
          (f) => f.status === "pending" && f.requesteeId === profileUserId
        ),
        sentRequests: merged.filter(
          (f) => f.status === "pending" && f.requesterId === profileUserId
        ),
      })
    );
  };

  const unsubRequester = listenToQuery(requesterQuery, (data) => {
    requesterFriends = data as Friend[];
    handleMergeAndDispatch();
  });

  const unsubRequestee = listenToQuery(requesteeQuery, (data) => {
    requesteeFriends = data as Friend[];
    handleMergeAndDispatch();
  });

  return () => {
    unsubRequester();
    unsubRequestee();
    dispatch(clearProfileFriends());
  };
};