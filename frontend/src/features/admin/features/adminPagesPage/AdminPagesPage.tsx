import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AdminFeatureManager from '../adminFeatureManager/AdminFeatureManager';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useDeletePageMutation, useGetPagesQuery } from '../../../page/pageApi';
import { DEFAULT_PERMISSIONS, type PageWithPermissions } from './adminPagesPageTypes';
import type { IPage } from '../../../page/pageTypes';
import AdminFeatureManagereCrudControls from '../adminFeatureManager/AdminFeatureManagereCrudControls';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useCrudWithFeedback } from '../../hooks/useCrudWithFeedback';
import { elementsApi, useDeleteElementsMutation } from '../../../elements/elementsApi';
import { useAppDispatch } from '../../../../store/hooks';
import { lightenHex } from '../../../../utils/colorUtils';
import { useNavigation } from '../../../../hooks/useNavigate';

const AdminPagesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { data: theme } = useGetActiveThemeQuery();
  const { data: pages, isLoading } = useGetPagesQuery();
  const pageEditor = pages?.find((p) => p.pageName === 'AdminPageEditor')
  const nonAdminPages = pages?.filter(p => !p.pagePath.startsWith('/admin'));
  const [deletePage] = useDeletePageMutation();
  const [deleteElement] = useDeleteElementsMutation();
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
    itemName: 'theme',
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
    '/': { delete: false },
    '/page-not-found': { delete: false },
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

  const handleUpdate = (p: PageWithPermissions) => {
    console.log('Update', p)
  }

  const handleDelete = (p: PageWithPermissions) => {
    confirmDelete(p._id)
  }

  const PageCard = ({
      pageItem,
      onSpecialAction,
      onRead,
      onUpdate,
      onDelete,
    }: {
      pageItem: PageWithPermissions;
      onSpecialAction?: (item: PageWithPermissions) => void;
      onRead?: (item: PageWithPermissions) => void;
      onUpdate?: (item: PageWithPermissions) => void;
      onDelete?: (item: PageWithPermissions) => void;
    }) => {
      const permissions = pageItem.permissions || {};
  
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: 80,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 1,
            position: 'relative',
            boxSizing: 'border-box',
            p:2
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 2,
            }}
          >
            <AdminFeatureManagereCrudControls
              item={pageItem}
              permissions={permissions}
              onSpecialAction={onSpecialAction}
              specialAction={{
                title: "Page Editor",
                icon: <ConstructionIcon fontSize="small" />,
                color: theme?.secondary.main
              }}
              onRead={onRead}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </Box>
          <Box
            sx={{
              isplay: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme?.neutral.content,
                textTransform: 'capitalize',
                fontFamily: "SecondaryFont",
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {pageItem.pageName}
              <Typography
                variant="caption"
                sx={{
                  color: pageItem.pageActive ? theme?.success.main : theme?.error.main,
                  textTransform: 'capitalize',
                  fontFamily: "SecondaryFont",
                  display: 'flex',
                  ml: 1,
                }}
              >
                {pageItem.pageActive ? '(Active)' : '(Inactive)'}
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: lightenHex(theme?.neutral.content!, 0.5),
                textTransform: 'lowercase',
                fontFamily: "SecondaryFont",
              }}
            >
              {pageItem.pagePath}
            </Typography>
          </Box>
        </Box>
      );
  };

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
          renderItem={(pageItem) => (
            <PageCard
              pageItem={pageItem}
              onRead={(p) => handleRead(p)}
              onSpecialAction={(p) => onSpecialAction(p)}
              onUpdate={(p) => handleUpdate(p)}
              onDelete={(p) => handleDelete(p)}
            />
          )}
        />
      )}
    </>
  );
};


export default AdminPagesPage;
