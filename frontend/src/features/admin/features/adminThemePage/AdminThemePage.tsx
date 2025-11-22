import React from 'react';
import { useChangeActiveThemeMutation, useCreateThemeMutation, useDeleteThemeMutation, useGetActiveThemeQuery, useGetThemesQuery, useUpdateThemeMutation } from '../../../theme/themeApi';
import { Box, CircularProgress } from '@mui/material';
import { DEFAULT_PERMISSIONS, type ThemeWithPermissions } from './adminThemePageTypes';
import type { ITheme } from "../../../theme/themeTypes";
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useCrudWithFeedback } from '../../hooks/useCrudWithFeedback';
import AdminFeatureManager from '../adminFeatureManager/AdminFeatureManager';
import ThemeMapItem from './adminThemeMapItem';
import { getThemeFormConfig } from './adminThemeFormConfig';

const AdminThemePage: React.FC = () => {
  const { data: theme } = useGetActiveThemeQuery();
  const { data: themes, isLoading } = useGetThemesQuery();
  const [changeActiveTheme] = useChangeActiveThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();
  const [createTheme] = useCreateThemeMutation();
  const [updateTheme] = useUpdateThemeMutation();
  
  const { executeWithFeedback } = useCrudWithFeedback();

  const handleThemeActivate = async (theme: ITheme) => {
    await executeWithFeedback(
      () => changeActiveTheme(theme._id ?? '').unwrap(),
      { successMessage: 'Theme activated successfully' }
    );
  };

  const { confirmDelete } = useDeleteConfirmation({
    onConfirm: async (id?: string) => {
      if (!id) return; 
      await executeWithFeedback(() => deleteTheme(id).unwrap(), {
        successMessage: 'Theme deleted successfully',
      });
    },
    canDelete: (id?: string) => {
      if (id === theme?._id) {
        return {
          canDelete: false,
          reason: 'Unable to delete the currently active theme. Please activate a different theme first.',
        };
      }
      return true;
    },
    title: "Delete this theme?",
    body: "Are you sure you want to delete this theme, and all of its associated data? This action cannot be undone.",
    itemName: 'theme',
  });
  
  const addPermissionsToThemes = (
    themes?: ITheme[],
    overrides?: Record<string, Partial<typeof DEFAULT_PERMISSIONS>>
  ): ThemeWithPermissions[] => {
    if (!themes) return [];
    return themes.map(theme => ({
      ...theme,
      permissions: {
        ...DEFAULT_PERMISSIONS,
        ...(overrides?.[theme.name] || {}),
      },
    }));
  };

  const themeOverrides = {
    'Rkitech': { delete: false },
    [theme?.name ?? '']: { delete: false }
  };

  const enrichedThemes = addPermissionsToThemes(themes, themeOverrides);

  const handleRead = (t: ThemeWithPermissions) => {
    handleThemeActivate(t)
  }

  const handleDelete = (t: ThemeWithPermissions) => {
    confirmDelete(t._id)
  }
  
  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={35} sx={{ color: theme?.primary.main }} />
        </Box>
      ) : (
        
        <AdminFeatureManager
          editorName="Theme Editor"
          editorItems={enrichedThemes}
          formConfig={getThemeFormConfig({ createTheme, updateTheme })}
          renderItem={(themeItem, index, openForm) => (
            <ThemeMapItem
              key={index}
              themeItem={themeItem}
              onRead={handleRead}
              onUpdate={() => openForm?.(themeItem)}
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </>
  );
};

export default AdminThemePage;
