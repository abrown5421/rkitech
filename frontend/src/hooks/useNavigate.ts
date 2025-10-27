import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import type { IPage } from "../features/page/pageTypes";
import { setActivePageAnimateIn, setActivePageName } from "../features/page/activePageSlice";

export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (page: IPage) => {
    dispatch(setActivePageAnimateIn(false));

    setTimeout(() => {
      dispatch(setActivePageName(page.pageName));
      navigate(page.pagePath);
    }, 500);
  };
};