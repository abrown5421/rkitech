import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { listenToCollection } from "../services/database/listenForData";
import { setPages } from "../features/pages/pagesSlice";

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

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return loading;
};
