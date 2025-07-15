import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { closeDrawer } from "../features/drawer/drawerSlice";
import { setPartOfActivePageShell } from "../features/pageShell/pageShellSlice";

export const useClientNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useClientNavigation = (path: string, pageName: string, pageID: string) => () => {
    dispatch(closeDrawer());
    dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: false }));

    setTimeout(() => {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: pageName }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: pageID }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath);
    }, 500);
  };

  return useClientNavigation;
};