import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { IPage } from "../features/page/pageTypes";
import { setActivePageAnimateIn, setActivePageName } from "../features/page/activePageSlice";
import { closeDrawer, preCloseDrawer } from "../features/drawer/drawerSlice";

export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const drawer = useAppSelector((state) => state.drawer);

  return (page: IPage) => {
    dispatch(setActivePageAnimateIn(false));
    if (drawer.open) {
      dispatch(preCloseDrawer())
    }
    setTimeout(() => {
      dispatch(setActivePageName(page.pageName));
      navigate(page.pagePath);
      if (drawer.open) {
        dispatch(closeDrawer())
      }
    }, 500);
  };
};