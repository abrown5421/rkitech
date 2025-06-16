import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setActiveClientPage } from "../features/pages/activeClientPageSlice";

export const useClientNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useClientNavigation = (path: string, pageName: string) => () => {
    dispatch(setActiveClientPage({ key: "activeClientPageIn", value: false }));

    setTimeout(() => {
      dispatch(setActiveClientPage({ key: "activeClientPageName", value: pageName }));
      dispatch(setActiveClientPage({ key: "activeClientPageIn", value: true }));
      dispatch(setActiveClientPage({ key: "activeClientPageId", value: true }));
      
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath)
    }, 500);
  };

  return useClientNavigation;
};