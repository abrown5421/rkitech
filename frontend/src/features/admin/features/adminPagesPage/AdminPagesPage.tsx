import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import AdminFeatureManager from '../adminFeatureManager/AdminFeatureManager';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useDeletePageMutation, useGetPagesQuery } from '../../../page/pageApi';
import { DEFAULT_PERMISSIONS, type PageWithPermissions } from './adminPagesPageTypes';
import type { IPage } from '../../../page/pageTypes';
import AdminFeatureManagereCrudControls from '../adminFeatureManager/AdminFeatureManagereCrudControls';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useCrudWithFeedback } from '../../hooks/useCrudWithFeedback';

const AdminPagesPage: React.FC = () => {
  const { data: theme } = useGetActiveThemeQuery();
  const { data: pages, isLoading } = useGetPagesQuery();
  const nonAdminPages = pages?.filter(p => !p.pagePath.startsWith('/admin'));
  const [deletePage] = useDeletePageMutation();
  const { executeWithFeedback } = useCrudWithFeedback();
  
  const { confirmDelete } = useDeleteConfirmation({
    onConfirm: async (id?: string) => {
      if (!id) return; 
      await executeWithFeedback(() => deletePage(id).unwrap(), {
        successMessage: 'Page deleted successfully',
      });
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
    return pages.map(page => ({
      ...page,
      permissions: {
        ...DEFAULT_PERMISSIONS,
        ...(overrides?.[page.pagePath] || {}),
      },
    }));
  };

  const pageOverrides = {
    '/': { delete: false },
    '/page-not-found': { delete: false },
  };

  const enrichedPages = addPermissionsToPages(nonAdminPages, pageOverrides);

  const handleRead = (p: PageWithPermissions) => {
    const url = window.location.origin + p.pagePath;
    console.log(url)
    window.open(url, "_blank");
  }

  const handleUpdate = (p: PageWithPermissions) => {
    console.log('Update', p)
  }

  const handleDelete = (p: PageWithPermissions) => {
    confirmDelete(p._id)
  }

  const PageCard = ({
      pageItem,
      onRead,
      onUpdate,
      onDelete,
    }: {
      pageItem: PageWithPermissions;
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
            width: 'calc(20% - 16px)',
            minWidth: 150, 
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
              onRead={onRead}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme?.neutral.content,
              textTransform: 'capitalize',
              fontFamily: "SecondaryFont"
            }}
          >
            {pageItem.pageName}
          </Typography>
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
          renderItem={(pageItem) => (
            <PageCard
              pageItem={pageItem}
              onRead={(p) => handleRead(p)}
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
