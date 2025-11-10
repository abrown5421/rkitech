import { useNavigation } from "../../hooks/useNavigate";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { pagesApi } from "../page/pageApi";
import { closeDrawer, openDrawer, preCloseDrawer } from "../drawer/drawerSlice";
import { useGetActiveThemeQuery } from "../theme/themeApi"; 
import { openModal } from "../modal/modalSlice";
import { logoutAdmin } from "../admin/features/auth/authSlice";
import Cookies from 'js-cookie';

export function useElementActions() {
  const navigation = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);
  const dispatch = useAppDispatch();
  const { data: theme } = useGetActiveThemeQuery(); 

  const [fetchPageById] = pagesApi.endpoints.getPageById.useLazyQuery();

  const resolveThemeValue = (value: any) => {
    if (typeof value === 'string' && value.startsWith('$theme.')) {
      const path = value.replace('$theme.', '').split('.');
      let result: any = theme;
      
      for (const key of path) {
        if (result && typeof result === 'object') {
          result = result[key];
        } else {
          return value; 
        }
      }
      
      return result ?? value;
    }
    return value;
  };

  const handlers: Record<string, (payload: any) => void> = {
    internalNav: async (payload) => {
      if (!payload.pageLinkId) return;

      const { data: pageData } = await fetchPageById(payload.pageLinkId);

      const page = Array.isArray(pageData) ? pageData[0] : pageData;
      if (!page || page.pageName === activePage.activePageName) return;

      navigation(page);
    },

    externalNav: (payload) => {
      window.open(payload.url, "_blank");
    },

    log: (payload) => {
      console.log(payload.message);
    },

    openDrawer: (payload) => {
      console.log(payload);
      dispatch(
        openDrawer({
          open: true,
          orientation: payload.orientation ?? "right",
          screenPercentage: payload.screenPercentage ?? 25,
          backgroundColor: resolveThemeValue(payload.backgroundColor) ?? "#ffffff",
          children: payload.childrenElementIds ?? [],
          entrance: payload.entrance ?? "animate__slideInRight",
          exit: payload.exit ?? "animate__slideOutRight"
        })
      );
    },
    
    openModal: (payload) => {
      dispatch(
        openModal({
          open: true,
          closeable: payload.closeable ?? true,
          title: payload.title ?? "",
          entrance: payload.entrance ?? "animate__flipInX",
          exit: payload.exit ?? "animate__flipOutX",
          children: payload.childrenElementIds ?? [],
          backgroundColor: resolveThemeValue(payload.backgroundColor)
        })
      );
    },

    handleLogout: () => {
      dispatch(preCloseDrawer())
      setTimeout(() => {
        dispatch(logoutAdmin())
        setTimeout(() => {
          dispatch(closeDrawer())
          Cookies.remove('adminUser');
        }, 500)
      }, 500)
    }
  };

  return (actionData: any) => {
    if (!actionData) return;

    if (actionData.type) {
      return handlers[actionData.type]?.(actionData);
    }

    if (Array.isArray(actionData)) {
      actionData.forEach((a) => handlers[a.type]?.(a));
    }
  };
}