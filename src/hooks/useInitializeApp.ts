import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { listenToCollection } from "../services/database/listenForData";
import { setComponents, setPages } from "../store/globalSlices/initialApp/initialAppSlice";

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
      listenToCollection("Components", (data) => {
        const componentsWithDocId = data.map(({ id, ...rest }) => ({
          componentID: id,
          ...rest,
        }));
        dispatch(setComponents(componentsWithDocId));
        setLoading(false);
      })
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return loading;
};
