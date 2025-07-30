import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { listenToCollection, listenToDocument } from "../services/database/listenForData";
import { setPages } from "../features/pages/pagesSlice";
import { setMenus } from "../app/globalSlices/menus/menusSlice";
import Cookies from "js-cookie";
import { clearAuthUser, setAuthUser } from "../features/auth/authUserSlice";
import type { AuthUser } from "../features/auth/authUserTypes";

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

