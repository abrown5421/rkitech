import { useCallback } from "react";
import { useAppDispatch } from "../app/hooks";
import { listenToCollection, listenToDocument, listenToQuery } from "../services/database/listenForData";
import { setMenus } from "../client/features/menus/menusSlice";
import Cookies from "js-cookie";
import { buildQuery } from "../services/database/queryBuilder";
import type { ClientAuthUser } from "../client/features/auth/ClientAuthUserTypes";
import { setPages } from "../client/features/pages/pagesSlice";
import { clearClientAuthUser, setClientAuthUser } from "../client/features/auth/clientAuthUserSlice";
import type { Friend } from "../client/features/friends/friendTypes";
import { setFriends } from "../client/features/friends/myFriendSlice";
import type { Notification } from "../client/features/notifications/notificationTypes";
import { setNotifications } from "../client/features/notifications/notificationSlice";

export const useInitializeApp = () => {
  const dispatch = useAppDispatch();

  const initializeApp = useCallback((parsedUser: ClientAuthUser | null) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      listenToCollection("Pages", (data) => {
        const pagesWithDocId = data.map(({ id, ...rest }) => ({
          pageID: id,
          ...rest,
        }));
        dispatch(setPages(pagesWithDocId));
      })
    );

    unsubscribers.push(
      listenToCollection("Menus", (data) => {
        const menusWithDocId = data.map(({ id, ...rest }) => ({
          menuID: id,
          ...rest,
        }));
        dispatch(setMenus(menusWithDocId));
      })
    );

    if (parsedUser) {
      const unsubscribeUser = listenToDocument("Users", parsedUser.userId, (data) => {
        if (data) {
          dispatch(setClientAuthUser({ ...(data as ClientAuthUser), userId: parsedUser.userId }));
        } else {
          Cookies.remove("authUser");
          dispatch(clearClientAuthUser());
        }
      });
      unsubscribers.push(unsubscribeUser);

      const requesterQuery = buildQuery("Friends", [["requesterId", "==", parsedUser.userId]]);
      const requesteeQuery = buildQuery("Friends", [["requesteeId", "==", parsedUser.userId]]);

      let requesterFriends: Friend[] = [];
      let requesteeFriends: Friend[] = [];

      const handleMergeAndDispatch = () => {
        const merged = [...requesterFriends, ...requesteeFriends];

        dispatch(
          setFriends({
            friends: merged.filter((f) => f.status === "accepted"),
            requests: merged.filter(
              (f) => f.status === "pending" && f.requesteeId === parsedUser.userId
            ),
            sentRequests: merged.filter(
              (f) => f.status === "pending" && f.requesterId === parsedUser.userId
            ),
          })
        );
      };

      const unsubscribeRequester = listenToQuery(requesterQuery, (data) => {
        requesterFriends = data as Friend[];
        handleMergeAndDispatch();
      });

      const unsubscribeRequestee = listenToQuery(requesteeQuery, (data) => {
        requesteeFriends = data as Friend[];
        handleMergeAndDispatch();
      });

      const notificationsQuery = buildQuery("Notifications", [
        ["userId", "==", parsedUser.userId],
        ["isRead", "==", false],
      ]);

      const unsubscribeNotifications = listenToQuery(notificationsQuery, (data) => {
        const notifications = data.map((doc: any) => ({
          id: doc.id,
          senderUserId: doc.senderUserId, 
          recieverUserId: doc.recieverUserId, 
          type: doc.type,
          isRead: doc.isRead,
          createdAt: doc.createdAt,
          targetPageName: doc.targetPageName,
        })) as Notification[];

        dispatch(setNotifications(notifications));
      });

      unsubscribers.push(unsubscribeRequester, unsubscribeRequestee, unsubscribeNotifications);
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [dispatch]);

  return initializeApp;
};