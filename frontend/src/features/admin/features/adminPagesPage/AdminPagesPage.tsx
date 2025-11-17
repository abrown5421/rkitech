import React from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDeletePageMutation, useGetPagesQuery, useCreatePageMutation, useUpdatePageMutation } from '../../../page/pageApi';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import type { IPage } from '../../../page/pageTypes';
import { DEFAULT_PAGE } from './adminPagesPageTypes';
import FontPicker from '../../../../components/fontPicker/FontPicker';
import ColorPicker from '../../../../components/colorPicker/ColorPicker';
import { AnimationPicker } from '../../../../components/animationPicker/AnimationPicker';
import type { FontType } from '../../../../components/fontPicker/fontPickerTypes';
import type { EntranceAnimation, ExitAnimation } from '../../../../components/animBox/animBoxTypes';
import { elementsApi, useCreateElementsMutation, useDeleteElementsMutation } from '../../../elements/elementsApi';
import { useAppDispatch } from '../../../../store/hooks';
import { useAdminPageState } from '../../../../hooks/useAdminPageState';
import { useEntityEditor } from '../../../../hooks/useEntityEditor';
import { useCrudWithFeedback } from '../../../../hooks/useCrudWithFeedback';
import { useDeleteConfirmation } from '../../../../hooks/useDeleteConfirmation';
import { FormRow } from '../../components/admin/FormRow';
import { EditorActions } from '../../components/admin/EditorActions';
import { QueryStateHandler } from '../../components/admin/QueryStateHandler';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { EntityActionButtons } from '../../components/admin/EntityAction';

const AdminPagesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: pages, isLoading, isError } = useGetPagesQuery();
  const { data: theme } = useGetActiveThemeQuery();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [createPage] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [createElements] = useCreateElementsMutation();
  const [deleteElement] = useDeleteElementsMutation();

  const {
    itemId,
    isCreating,
    isEditing,
    navigateToCreate,
    navigateToEdit,
    navigateToList,
    navigateToPath,
    navigateToPage,
    activePage,
  } = useAdminPageState();

  const thisPage = pages?.find((p) => p._id === itemId);

  const { entity, isChanged, handleChange, handleRevert } = useEntityEditor<IPage>({
    defaultEntity: DEFAULT_PAGE,
    currentEntity: thisPage,
    isNew: isCreating,
  });

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

      await executeWithFeedback(
        () => deletePage(id).unwrap(),
        {
          successMessage: 'Page and associated elements deleted successfully',
          onSuccess: navigateToList,
        }
      );
    },
    canDelete: (id?: string) => {
      const page = pages?.find((p) => p._id === id);
      if (!page) return false;

      if (page.pagePath === '/' || page.pagePath === '/page-not-found') {
        return { canDelete: false, reason: 'This page cannot be deleted as it is required for the system.' };
      }
      return true;
    },
    itemName: 'page',
  });

  const handlePageSave = async () => {
    const mutation = async () => {
      if (isCreating) {
        const pageData = { ...entity };
        if (pageData.pageRenderMethod === 'dynamic') {
          const pageNameElement = {
            type: 'typography',
            data: {
              variant: 'body1',
              text: `${pageData.pageName || 'Page'}`,
            },
            name: `${pageData.pageName || 'Page'} body text`,
          };

          const createdPageNameElement = await createElements(pageNameElement).unwrap();

          const rootElement = {
            type: 'box',
            sx: {
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              minHeight: 'calc(100vh - 50px)',
              backgroundColor: '$theme.neutral.main',
              m: 3,
            },
            children: [`${createdPageNameElement.data._id}`],
            order: 0,
            name: `${pageData.pageName || 'Page'} root`,
          };

          const createdElement = await createElements(rootElement).unwrap();
          pageData.pageContent = [`${createdElement.data._id}`];
        }

        return await createPage(pageData).unwrap();
      } else {
        return await updatePage({ id: itemId!, data: entity! }).unwrap();
      }
    };

    await executeWithFeedback(mutation, {
      successMessage: isCreating ? 'Page created successfully' : 'Page updated successfully',
      onSuccess: isCreating ? navigateToList : undefined,
    });
  };

  const filteredPages = pages?.filter(
    (page) => !page.pagePath?.toLowerCase().startsWith('/admin')
  ) || [];

  if (isCreating || isEditing) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'scroll' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'PrimaryFont' }}>
            {isCreating ? 'New Page Editor' : `Editing ${entity?.pageName} Page`}
          </Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigateToPath(`${activePage.activePageObj?.pagePath}?action=new`)}
            sx={{
              backgroundColor: theme?.primary.main,
              color: theme?.primary.content,
              border: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme?.neutral.main,
                color: theme?.primary.main,
                borderColor: theme?.primary.main,
              },
            }}
          >
            Edit Page
          </Button>
        </Box>

        <FormRow>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              disabled={entity?.pagePath === '/'}
              size="small"
              label="Page Path"
              value={entity?.pagePath || ''}
              onChange={(e) => handleChange({ pagePath: e.target.value })}
              helperText={entity?.pagePath === '/' ? "The root route cannot be modified" : "The URL the page should be present at"}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Render Method</InputLabel>
              <Select
                size="small"
                value={entity?.pageRenderMethod || 'static'}
                label="Render Method"
                onChange={(e) => handleChange({ pageRenderMethod: e.target.value as 'static' | 'dynamic' })}
              >
                <MenuItem value="static">Static</MenuItem>
                <MenuItem value="dynamic">Dynamic</MenuItem>
              </Select>
              <FormHelperText>Static pages are fixed, dynamic can be edited</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Page Status</InputLabel>
              <Select
                size="small"
                value={entity?.pageActive ? 'true' : 'false'}
                label="Page Status"
                onChange={(e) => handleChange({ pageActive: e.target.value === 'true' })}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
              <FormHelperText>Hide pages without deleting them</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <ColorPicker
              inputProps={{
                label: 'Page Color',
                sx: { width: '100%' },
                helperText: 'The background color of the page',
              }}
              color={entity?.pageColor || ''}
              onChange={(color) => handleChange({ pageColor: color })}
            />
          </Box>
        </FormRow>

        <FormRow>
          <Box sx={{ flex: 1 }}>
            <FontPicker
              inputProps={{
                label: 'Page Font',
                sx: { width: '100%' },
                helperText: 'The font family used by all text on the page',
              }}
              font={(entity?.pageFontFamily as FontType) || 'PrimaryFont'}
              onChange={(font) => handleChange({ pageFontFamily: font })}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ColorPicker
              inputProps={{
                label: 'Font Color',
                sx: { width: '100%' },
                helperText: 'The font color of the page',
              }}
              color={entity?.pageFontColor || ''}
              onChange={(color) => handleChange({ pageFontColor: color })}
            />
          </Box>
          <AnimationPicker
            entrance={(entity?.pageEntranceAnimation as EntranceAnimation) || ''}
            exit={(entity?.pageExitAnimation as ExitAnimation) || ''}
            onEntChange={(entrance) => handleChange({ pageEntranceAnimation: entrance })}
            onExtChange={(exit) => handleChange({ pageExitAnimation: exit })}
          />
        </FormRow>

        <EditorActions
          isNew={isCreating}
          isChanged={isChanged}
          isSaving={isUpdating}
          onSave={handlePageSave}
          onRevert={handleRevert}
          saveText="Save Page"
        />
      </Box>
    );
  }

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      data={pages}
      loadingText="Loading pages..."
      errorText="Failed to load pages."
    >
      <AdminPageLayout title="Page Manager" onAddNew={navigateToCreate} addButtonText="Add New Page">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredPages.map((page) => (
            <Box
              key={page._id}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontFamily: 'SecondaryFont', color: theme?.neutral.content }}>
                  {page.pageName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: theme?.neutral.content }}>
                  {page.pagePath}
                </Typography>
                <Typography
                  variant="caption"
                  sx={page.pageActive ? { color: theme?.success.main } : { color: theme?.error.main }}
                >
                  {page.pageActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>

              <EntityActionButtons
                actions={[
                  {
                    icon: 'edit',
                    tooltip: 'Edit',
                    onClick: (e) => {
                      e.stopPropagation();
                    },
                    show: page.pageRenderMethod === 'dynamic',
                  },
                  {
                    icon: 'settings',
                    tooltip: 'Settings',
                    onClick: (e) => {
                      e.stopPropagation();
                      navigateToEdit(page._id!);
                    },
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Delete',
                    onClick: (e) => {
                      e.stopPropagation();
                      confirmDelete(page._id);
                    },
                    show: page.pagePath !== '/' && page.pagePath !== '/page-not-found',
                    isLoading: isDeleting,
                  },
                  {
                    icon: 'view',
                    tooltip: 'View',
                    onClick: (e) => {
                      e.stopPropagation();
                      navigateToPage(page);
                    },
                  },
                ]}
              />
            </Box>
          ))}
        </Box>
      </AdminPageLayout>
    </QueryStateHandler>
  );
};

export default AdminPagesPage;