import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminFeatureManager from '../adminFeatureManager/AdminFeatureManager';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { 
  useCreatePageMutation,
  useDeletePageMutation, 
  useGetPagesQuery,
  useUpdatePageMutation,
} from '../../../page/pageApi';
import { DEFAULT_PERMISSIONS, type PageWithPermissions } from './adminPagesPageTypes';
import type { IPage } from '../../../page/pageTypes';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useCrudWithFeedback } from '../../hooks/useCrudWithFeedback';
import { elementsApi, useCreateElementsMutation, useDeleteElementsMutation } from '../../../elements/elementsApi';
import { useAppDispatch } from '../../../../store/hooks';
import { useNavigation } from '../../../../hooks/useNavigate';
import { getPageFormConfig } from './adminPagesFormConfig';
import PageMapItem from './adminPagesMapItem';

const AdminPagesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { data: theme } = useGetActiveThemeQuery();
  const { data: pages, isLoading } = useGetPagesQuery();
  const pageEditor = pages?.find((p) => p.pageName === 'AdminPageEditor');
  const nonAdminPages = pages?.filter(p => !p.pagePath.startsWith('/admin'));
  const [deletePage] = useDeletePageMutation();
  const [deleteElement] = useDeleteElementsMutation();
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [createElements] = useCreateElementsMutation();
  const { executeWithFeedback } = useCrudWithFeedback();
  
  const deleteElementRecursively = async (elementId: string): Promise<void> => {
    try {
      const subscription = dispatch(
        elementsApi.endpoints.getElementsById.initiate(elementId)
      );
      const { data } = await subscription;
      const element = Array.isArray(data) ? data[0] : data;

      if (!element) {
        console.warn(`Skipping deletion of element ${elementId} - not found`);
        subscription.unsubscribe();
        return;
      }

      if (Array.isArray(element.children) && element.children.length > 0) {
        for (const childId of element.children) {
          await deleteElementRecursively(childId);
        }
      }

      await deleteElement(elementId).unwrap();
      subscription.unsubscribe();
    } catch (error) {
      console.error(`Failed to delete element ${elementId}:`, error);
    }
  };

  const { confirmDelete } = useDeleteConfirmation({
    onConfirm: async (id?: string) => {
      if (!id) return; 

      const pageToDelete = pages?.find((p) => p._id === id);
      if (!pageToDelete) return;

      if (pageToDelete.pageContent && Array.isArray(pageToDelete.pageContent)) {
        for (const rootElementId of pageToDelete.pageContent) {
          await deleteElementRecursively(rootElementId);
        }
      }

      await executeWithFeedback(() => deletePage(id).unwrap(), {
        successMessage: 'Page deleted successfully',
      });
    },
    canDelete: (id?: string) => {
      const page = pages?.find((p) => p._id === id);
      if (!page) return false;

      if (page.pagePath === '/' || page.pagePath === '/page-not-found') {
        return { canDelete: false, reason: 'This page cannot be deleted as it is required for the system.' };
      }
      return true;
    },
    title: "Delete this page?",
    body: "Are you sure you want to delete this page, and all of its associated data? This action cannot be undone.",
    itemName: 'page',
  });

  const addPermissionsToPages = (
    pages?: IPage[],
    overrides?: Record<string, Partial<typeof DEFAULT_PERMISSIONS>>
  ): PageWithPermissions[] => {
    if (!pages) return [];
    
    return pages.map(page => {
      const isDynamic = page.pageRenderMethod === "dynamic";

      return {
        ...page,
        permissions: {
          ...DEFAULT_PERMISSIONS,
          onSpecialAction: isDynamic,
          ...(overrides?.[page.pagePath] || {}),
        },
      };
    });
  };

  const pageOverrides = {
    '/': { delete: false, update: false },
    '/page-not-found': { delete: false, update: false },
  };

  const enrichedPages = addPermissionsToPages(nonAdminPages, pageOverrides);

  const handleRead = (p: PageWithPermissions) => {
    const url = window.location.origin + p.pagePath;
    window.open(url, "_blank");
  }

  const onSpecialAction = (p: PageWithPermissions) => {
    if (!pageEditor) return;
    const updatedP = {
      ...p,
      pagePath: `/admin/page-editor?=${p._id}`, 
    };
    navigate(updatedP)
  }

  const handleDelete = (p: PageWithPermissions) => {
    confirmDelete(p._id)
  }

  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={35} sx={{ color: theme?.primary.main }} />
        </Box>
      ) : (
        <AdminFeatureManager
          editorName="Page Editor"
          editorItems={enrichedPages}
          orientation='column'
          formConfig={getPageFormConfig(theme, { createPage, createElements, updatePage })}
          renderItem={(pageItem, index, openForm) => (
            <PageMapItem
              key={index}
              pageItem={pageItem}
              onRead={(p) => handleRead(p)}
              onSpecialAction={(p) => onSpecialAction(p)}
              onUpdate={(p) => openForm?.(p)}
              onDelete={(p) => handleDelete(p)}
            />
          )}
        />
      )}
    </>
  );
};

export default AdminPagesPage;