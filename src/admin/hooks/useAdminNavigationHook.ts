import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setActiveAdminPage } from "../store/adminSlices/activeAdminPageSlice";


export const useAdminNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useAdminNavigation = (path: string, pageName: string) => () => {
    dispatch(setActiveAdminPage({ key: "activeAdminPageIn", value: false }));

    setTimeout(() => {
      dispatch(setActiveAdminPage({ key: "activeAdminPageName", value: pageName }));
      dispatch(setActiveAdminPage({ key: "activeAdminPageIn", value: true }));

      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath);
    }, 500);
  };

  return useAdminNavigation;
};