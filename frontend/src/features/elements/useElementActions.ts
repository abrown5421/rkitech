import { useNavigation } from "../../hooks/useNavigate";
import { useAppSelector } from "../../store/hooks";
import { pagesApi } from "../page/pageApi"; 

export function useElementActions() {
  const navigation = useNavigation();
  const activePage = useAppSelector((state) => state.activePage)

  const [fetchPageById] = pagesApi.endpoints.getPageById.useLazyQuery();

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
  };

  return (actionData: any) => {
    if (!actionData) return;

    if (actionData.type) {
      const fn = handlers[actionData.type];
      return fn?.(actionData);
    }

    if (Array.isArray(actionData)) {
      actionData.forEach((a) => handlers[a.type]?.(a));
    }
  };
}
