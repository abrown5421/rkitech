import { openModal } from "../features/modal/modalSlice";
import { modalCallbackRegistry } from "../features/modal/modalCallbackRegistry";
import { useGetActiveThemeQuery } from "../features/theme/themeApi";
import { useAppDispatch } from "../store/hooks";

interface UseDeleteConfirmationProps {
  onConfirm: (id?: string) => Promise<void>;
  canDelete?: (id?: string) => boolean | { canDelete: boolean; reason: string };
  itemName?: string;
}

export const useDeleteConfirmation = ({
  onConfirm,
  canDelete,
  itemName = "item",
}: UseDeleteConfirmationProps) => {
  const dispatch = useAppDispatch();
  const { data: theme } = useGetActiveThemeQuery();

  const confirmDelete = (id?: string) => {
    const callbackKey = crypto.randomUUID();

    if (canDelete) {
        const result = canDelete(id);
        if (typeof result === "object" && !result.canDelete) {
        dispatch(
            openModal({
            open: true,
            closeable: true,
            title: "Cannot Delete",
            body: result.reason,
            backgroundColor: theme?.neutral.main ?? "#fff",
            prefab: "confirm",
            callbackKey,
            })
        );

        modalCallbackRegistry.onConfirm[callbackKey] = () => {};
        return;
        } else if (result === false) {
        dispatch(
            openModal({
            open: true,
            closeable: true,
            title: "Cannot Delete",
            body: `This ${itemName} cannot be deleted at this time.`,
            backgroundColor: theme?.neutral.main ?? "#fff",
            prefab: "confirm",
            callbackKey,
            })
        );

        modalCallbackRegistry.onConfirm[callbackKey] = () => {};
        return;
        }
    }

    dispatch(
        openModal({
        open: true,
        closeable: true,
        title: `Delete this ${itemName}?`,
        body: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
        backgroundColor: theme?.neutral.main ?? "#fff",
        prefab: "confirmDeny",
        callbackKey,
        })
    );

    modalCallbackRegistry.onConfirm[callbackKey] = () => onConfirm(id);
    modalCallbackRegistry.onDeny[callbackKey] = () => {};
    };

  return { confirmDelete };
};
