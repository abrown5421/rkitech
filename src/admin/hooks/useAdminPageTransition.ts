import type { AnimationObject } from "../../components/container/containerTypes";
import { useAppSelector } from "../../store/hooks";

export const useAdminPageTransitionHook = (): AnimationObject => {
  const activeAdminPage = useAppSelector((state) => state.admin.activeAdminPage);

  return {
    entranceAnimation: 'animate__fadeIn',
    exitAnimation: 'animate__fadeOut',
    isEntering: activeAdminPage.activeAdminPageIn,
  };
};