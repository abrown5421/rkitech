import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setActiveModule } from "../store/globalSlices/activeModules/activeModuleSlice";

export const useModuleNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useModuleNavigation = (path: string, pageName: string) => () => {
    dispatch(setActiveModule({ key: "activeModuleIn", value: false }));

    setTimeout(() => {
      dispatch(setActiveModule({ key: "activeModuleName", value: pageName }));
      dispatch(setActiveModule({ key: "activeModuleIn", value: true }));
      
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath)
    }, 500);
  };

  return useModuleNavigation;
};