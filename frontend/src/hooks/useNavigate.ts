import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { IPage } from "../features/page/pageTypes";
import { 
  setActivePageAnimateIn, 
  setActivePageName, 
  setActivePageObj 
} from "../features/page/activePageSlice";
import { closeDrawer, preCloseDrawer } from "../features/drawer/drawerSlice";

export const navigateToPath = (path: string) => {
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);
  if (!activePage.activePageObj) return;
  navigate({
    ...activePage.activePageObj,
    pagePath: path,
  } as IPage, true);
};

export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const drawer = useAppSelector((state) => state.drawer);

  return (page: IPage, crossfade: boolean = true) => {
    if (!crossfade) {
      if (drawer.open) dispatch(preCloseDrawer());

      dispatch(setActivePageName(page.pageName));
      dispatch(setActivePageObj(page));
      navigate(page.pagePath);

      if (drawer.open) dispatch(closeDrawer());
      return;
    }

    dispatch(setActivePageAnimateIn(false));
    if (drawer.open) dispatch(preCloseDrawer());

    setTimeout(() => {
      dispatch(setActivePageName(page.pageName));
      dispatch(setActivePageObj(page)); 
      navigate(page.pagePath);

      if (drawer.open) dispatch(closeDrawer());

      setTimeout(() => {
        dispatch(setActivePageAnimateIn(true));
      }, 50);
    }, 500);
  };
};
