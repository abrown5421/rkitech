
import { useCallback } from "react";
import { useAppDispatch } from "../app/hooks";
import { listenToCollection, listenToDocument, listenToQuery } from "../services/database/listenForData";
import { setMenus } from "../client/features/menus/menusSlice";
import Cookies from "js-cookie";
import { buildQuery } from "../services/database/queryBuilder";
import type { ClientAuthUser } from "../client/features/auth/ClientAuthUserTypes";
import { setPages } from "../shared/features/pages/pagesSlice";
import { clearClientAuthUser, setClientAuthUser } from "../client/features/auth/clientAuthUserSlice";
import type { Friend } from "../client/features/friends/friendTypes";
import { setFriends } from "../client/features/friends/myFriendSlice";
import type { Notification } from "../client/features/notifications/notificationTypes";
import { setNotifications } from "../client/features/notifications/notificationSlice";
import { clearAdminAuthUser, setAdminAuthUser } from "../admin/features/auth/adminAuthUserSlice";
import type { AdminAuthUser } from "../admin/features/auth/adminAuthUserTypes";

export const useInitializeApp = () => {
  const dispatch = useAppDispatch();

  const initializeApp = useCallback(
    (clientUser: ClientAuthUser | null, adminUser: AdminAuthUser | null) => {
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

    if (clientUser) {
      const unsubscribeUser = listenToDocument("Users", clientUser.userId, (data) => {
        if (data) {
          dispatch(setClientAuthUser({ ...(data as ClientAuthUser), userId: clientUser.userId }));
        } else {
          Cookies.remove("authUser");
          dispatch(clearClientAuthUser());
        }
      });
      unsubscribers.push(unsubscribeUser);

      const requesterQuery = buildQuery("Friends", [["requesterId", "==", clientUser.userId]]);
      const requesteeQuery = buildQuery("Friends", [["requesteeId", "==", clientUser.userId]]);

      let requesterFriends: Friend[] = [];
      let requesteeFriends: Friend[] = [];

      const handleMergeAndDispatch = () => {
        const merged = [...requesterFriends, ...requesteeFriends];

        dispatch(
          setFriends({
            friends: merged.filter((f) => f.status === "accepted"),
            requests: merged.filter(
              (f) => f.status === "pending" && f.requesteeId === clientUser.userId
            ),
            sentRequests: merged.filter(
              (f) => f.status === "pending" && f.requesterId === clientUser.userId
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
        ["userId", "==", clientUser.userId],
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

    if (adminUser) {
      const unsubscribeAdminUser = listenToDocument(
        "Users",
        adminUser.userId,
        (data) => {
          if (data) {
            dispatch(
              setAdminAuthUser({ ...(data as AdminAuthUser), userId: adminUser.userId })
            );
          } else {
            Cookies.remove("adminAuthUser");
            dispatch(clearAdminAuthUser());
          }
        }
      );
      unsubscribers.push(unsubscribeAdminUser);

    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [dispatch]);

  return initializeApp;
};

