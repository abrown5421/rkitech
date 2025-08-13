import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openAlert } from '../../shared/features/alert/alertSlice';
import { setLoading, setNotLoading } from '../../app/globalSlices/loading/loadingSlice';
import { openModal } from '../../shared/features/modal/modalSlice';
import { updateDataInCollection } from '../../services/database/updateData';
import { deleteDocument } from '../../services/database/deleteData';

interface GenericEditorConfig<T> {
  collectionName: string;
  itemIdField: keyof T;
  sortField: keyof T;
  trackingFields: (keyof T)[];
  postsPerPage?: number;
  deleteConfirmationTitle?: string;
  deleteConfirmationMessage?: (item: T) => string;
}

export function useGenericEditor<T extends Record<string, any>>(
  items: T[],
  config: GenericEditorConfig<T>
) {
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const modalAction = useAppSelector((state) => state.modal.modalActionFire);
  
  const [localItems, setLocalItems] = useState<T[]>(items);
  const [originalItems, setOriginalItems] = useState<T[]>(items);
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = config.postsPerPage || 10;
  const totalPages = Math.ceil(localItems.length / postsPerPage);

  const paginatedItems = localItems.slice(
    currentPage * postsPerPage,
    currentPage * postsPerPage + postsPerPage
  );

  const isLoading = (type: string, itemId?: string) =>
    loading && id === `${type}${itemId ? '-' + itemId : ''}`;

  const hasChanges = JSON.stringify(
    localItems.map(item => 
      config.trackingFields.reduce((acc, field) => {
        acc[field] = item[field];
        return acc;
      }, {} as Partial<T>)
    )
  ) !== JSON.stringify(
    originalItems.map(item =>
      config.trackingFields.reduce((acc, field) => {
        acc[field] = item[field];
        return acc;
      }, {} as Partial<T>)
    )
  );

  useEffect(() => {
    const sorted = [...items].sort((a, b) => 
      String(a[config.sortField]).localeCompare(String(b[config.sortField]))
    );
    setLocalItems(sorted);
    setOriginalItems(sorted);
  }, [items, config.sortField]);

  // Handle modal actions for deletion
  useEffect(() => {
    if (!modalAction.modalActionFire) return;

    if (modalAction.modalActionId === 'deleteItem' && modalAction.idToDelete) {
      handleDeleteConfirmed(modalAction.idToDelete);
    }
  }, [modalAction]);

  const showAlert = (severity: 'success' | 'error', message: string) => {
    dispatch(openAlert({
      alertOpen: true,
      alertSeverity: severity,
      alertMessage: message,
      alertAnimation: {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: true,
      }
    }));
  };

  const updateItemField = (itemId: string, field: string, value: any) => {
    setLocalItems(prev =>
      prev.map(item => 
        item[config.itemIdField] === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDbAction = async (
    action: () => Promise<void>,
    { loadingId, successMsg, errorMsg }: { loadingId: string, successMsg: string, errorMsg: string }
  ) => {
    dispatch(setLoading({ loading: true, id: loadingId }));
    try {
      await action();
      showAlert('success', successMsg);
    } catch (error) {
      console.error(error);
      showAlert('error', errorMsg);
    } finally {
      dispatch(setNotLoading());
    }
  };

  const handleToggleActive = (itemId: string, currentValue: boolean) => {
    handleDbAction(
      async () => {
        const activeFieldName = getActiveFieldName(config.collectionName);
        await updateDataInCollection(config.collectionName, itemId, { 
          [activeFieldName]: !currentValue 
        });
        updateItemField(itemId, activeFieldName, !currentValue);
      },
      {
        loadingId: `toggle-${itemId}`,
        successMsg: `Item marked as ${!currentValue ? 'Active' : 'Inactive'}.`,
        errorMsg: 'Failed to update active state.'
      }
    );
  };

  const handleSave = (
    getChangedFields: (local: T, original: T) => Partial<T>,
    customSave?: (changedItems: T[], originalItems: T[]) => Promise<void>
  ) => {
    handleDbAction(
      async () => {
        if (customSave) {
          await customSave(localItems, originalItems);
          setOriginalItems(localItems);
          return;
        }

        const changedItems = localItems.filter((localItem, i) => {
          const original = originalItems[i];
          const changes = getChangedFields(localItem, original);
          return Object.keys(changes).length > 0;
        });

        await Promise.all(
          changedItems.map(item => {
            const original = originalItems.find(o => o[config.itemIdField] === item[config.itemIdField]);
            const changes = original ? getChangedFields(item, original) : {};
            return updateDataInCollection(config.collectionName, String(item[config.itemIdField]), changes);
          })
        );

        setOriginalItems(localItems);
      },
      {
        loadingId: 'save-items',
        successMsg: 'Changes saved successfully.',
        errorMsg: 'Failed to save changes.',
      }
    );
  };

  // Open confirmation modal for deletion
  const handleDelete = (itemId: string) => {
    const item = localItems.find(item => item[config.itemIdField] === itemId);
    if (!item) return;

    const defaultTitle = config.deleteConfirmationTitle || 'Delete Item?';
    const defaultMessage = `Are you sure you want to delete this item? This action cannot be undone.`;
    const message = config.deleteConfirmationMessage 
      ? config.deleteConfirmationMessage(item)
      : defaultMessage;

    dispatch(openModal({
      title: defaultTitle,
      modalType: "confirmOrDeny",
      modalMessage: message,
      modalProps: { 
        actionId: "deleteItem",
        idToDelete: itemId,
        requiresAuth: false 
      }
    }));
  };

  // Actually perform the deletion after confirmation
  const handleDeleteConfirmed = (itemId: string) => {
    handleDbAction(
      async () => {
        await deleteDocument(config.collectionName, itemId);
        setLocalItems(prev => prev.filter(item => item[config.itemIdField] !== itemId));
        setOriginalItems(prev => prev.filter(item => item[config.itemIdField] !== itemId));
      },
      {
        loadingId: `delete-${itemId}`,
        successMsg: 'Item deleted successfully.',
        errorMsg: 'Failed to delete item.'
      }
    );
  };

  const resetChanges = () => {
    setLocalItems(originalItems);
  };

  return {
    localItems,
    paginatedItems,
    currentPage,
    totalPages,
    hasChanges,
    isLoading,
    updateItemField,
    handleToggleActive,
    handleSave,
    handleDelete, 
    resetChanges,
    setCurrentPage,
  };
}

function getActiveFieldName(collectionName: string): string {
  switch (collectionName) {
    case 'Gallery': return 'imageActive';
    case 'Blog': return 'postActive';
    case 'Staff': return 'staffActive';
    default: return 'active';
  }
}