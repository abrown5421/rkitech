import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setActiveClientPage } from "../features/pages/activeClientPageSlice";
import { closeDrawer } from "../../components/drawer/drawerSlice";

export const useClientNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useClientNavigation = (path: string, pageName: string, pageID: string) => () => {
    dispatch(closeDrawer('navDrawer'))
    dispatch(setActiveClientPage({ key: "activeClientPageIn", value: false }));

    setTimeout(() => {
      dispatch(setActiveClientPage({ key: "activeClientPageName", value: pageName }));
      dispatch(setActiveClientPage({ key: "activeClientPageId", value: pageID }));
      dispatch(setActiveClientPage({ key: "activeClientPageIn", value: true }));
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath);
    }, 500);
  };

  return useClientNavigation;
};