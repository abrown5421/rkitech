import { useCallback } from "react";
import { useNavigation } from "../../../hooks/useNavigate";
import { pagesApi } from "../page/pageApi";
import { openAlert } from "../alert/alertSlice";
import { getAction } from "./actionRegistry";
import type { ActionExecutionRequest } from "./actionTypes";
import { useAppDispatch } from "../../../store/hooks";

export const useActionExecutor = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const navigateToPage = useCallback(
    async (pageUniqueId: string, animate: boolean = true) => {
        try {
        const result = await dispatch(
            pagesApi.endpoints.getPageByUniqueId.initiate(pageUniqueId)
        ).unwrap();

        if (result) {
            navigation(result, animate);
        } else {
            dispatch(
            openAlert({
                severity: "error",
                body: `Page not found: ${pageUniqueId}`,
                closeable: true,
                orientation: "bottom-right",
                entrance: "animate__fadeInRight",
                exit: "animate__fadeOutRight"
            })
            );
        }
        } catch (err) {
        dispatch(
            openAlert({
            severity: "error",
            body: `Error fetching page: ${err}`,
            closeable: true,
            orientation: "bottom-right",
            entrance: "animate__fadeInRight",
            exit: "animate__fadeOutRight"
            })
        );
        }
    },
    [navigation, dispatch]
    );

  const executeAction = useCallback(
    (request: ActionExecutionRequest<any>) => {
      const action = getAction(request.type);

      if (!action) {
        console.error("Unknown action:", request.type);
        return;
      }

      const hooks = { navigateToPage };

      try {
        action.execute(request.params, hooks);
      } catch (error) {
        console.error("Error in action:", error);

        dispatch(
          openAlert({
            severity: "error",
            body: `Error executing action: ${error}`,
            closeable: true,
            orientation: "bottom-right",
            entrance: "animate__fadeInRight",
            exit: "animate__fadeOutRight"
          })
        );
      }
    },
    [navigateToPage]
  );

  return executeAction;
};
