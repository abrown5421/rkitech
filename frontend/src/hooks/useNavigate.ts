import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import type { IPage } from "../features/frontend/page/pageTypes";
import { setActivePageAnimateIn, setActivePageObj, setActivePageUid } from "../features/frontend/page/pageSlice";

export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (page: IPage, animate: boolean = true) => {
    if (!animate) {
      dispatch(setActivePageUid(page.pageName));
      dispatch(setActivePageObj(page));
      navigate(page.pagePath);
      return;
    }

    setTimeout(() => {
      dispatch(setActivePageUid(page.pageName));
      dispatch(setActivePageObj(page)); 
      navigate(page.pagePath);

      setTimeout(() => {
        dispatch(setActivePageAnimateIn(true));
      }, 50);
    }, 500);
  };
};
