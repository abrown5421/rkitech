import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { listenToCollection, listenToDocument, listenToQuery } from "../services/database/listenForData";
import { setPages } from "../features/pages/pagesSlice";
import { setMenus } from "../app/globalSlices/menus/menusSlice";
import Cookies from "js-cookie";
import { clearAuthUser, setAuthUser } from "../features/auth/authUserSlice";
import type { AuthUser } from "../features/auth/authUserTypes";
import type { Friend } from "../features/friends/friendTypes";
import { setFriends } from "../features/friends/friendSlice";
import { setNotifications } from "../features/notifications/notificationSlice";
import type { Notification } from "../features/notifications/notificationTypes";
import { buildQuery } from "../services/database/queryBuilder";

export const useInitializeApp = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      listenToCollection("Pages", (data) => {
        const pagesWithDocId = data.map(({ id, ...rest }) => ({
          pageID: id,
          ...rest,
        }));
        dispatch(setPages(pagesWithDocId));
        setLoading(false);
      })
    );

    unsubscribers.push(
      listenToCollection("Menus", (data) => {
        const menusWithDocId = data.map(({ id, ...rest }) => ({
          menuID: id,
          ...rest,
        }));
        dispatch(setMenus(menusWithDocId));
        setLoading(false);
      })
    );

    const storedUser = Cookies.get("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        const unsubscribeUser = listenToDocument("Users", parsedUser.userId, (data) => {
          if (data) {
            dispatch(setAuthUser({ ...(data as AuthUser), userId: parsedUser.userId }));
          } else {
            Cookies.remove("authUser");
            dispatch(clearAuthUser());
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

        const notificationsQuery = buildQuery("Notifications", [["userId", "==", parsedUser.userId]]);

        const unsubscribeNotifications = listenToQuery(notificationsQuery, (data) => {
          const notifications = data.map((doc: any) => ({
            id: doc.id,
            userId: doc.userId,
            type: doc.type,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
            targetPageName: doc.targetPageName,
          })) as Notification[];

          dispatch(setNotifications(notifications));
        });

        unsubscribers.push(unsubscribeRequester, unsubscribeRequestee, unsubscribeNotifications);
      } catch (e) {
        console.error("Failed to parse user cookie", e);
        Cookies.remove("authUser");
      }
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [dispatch]);

  return loading;
};
