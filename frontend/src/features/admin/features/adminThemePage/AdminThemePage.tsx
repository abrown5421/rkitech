import React from 'react';
import { useChangeActiveThemeMutation, useDeleteThemeMutation, useGetActiveThemeQuery, useGetThemesQuery } from '../../../theme/themeApi';
import { Box, CircularProgress, Typography } from '@mui/material';
import { COLOR_KEYS, DEFAULT_PERMISSIONS, type ThemeWithPermissions } from './adminThemePageTypes';
import type { ITheme } from "../../../theme/themeTypes";
import AdminFeatureManagereCrudControls from '../adminFeatureManager/AdminFeatureManagereCrudControls';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useCrudWithFeedback } from '../../hooks/useCrudWithFeedback';
import AdminFeatureManager from '../adminFeatureManager/AdminFeatureManager';

const AdminThemePage: React.FC = () => {
  const { data: theme } = useGetActiveThemeQuery();
  const { data: themes, isLoading } = useGetThemesQuery();
  const [changeActiveTheme] = useChangeActiveThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();
  
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
  };

  const enrichedThemes = addPermissionsToThemes(themes, themeOverrides);

  const handleRead = (t: ThemeWithPermissions) => {
    handleThemeActivate(t)
  }

  const handleUpdate = (t: ThemeWithPermissions) => {
    console.log('Update', t)
  }

  const handleDelete = (t: ThemeWithPermissions) => {
    confirmDelete(t._id)
  }
  
  const ThemeCard = ({
    themeItem,
    onRead,
    onUpdate,
    onDelete,
  }: {
    themeItem: ThemeWithPermissions;
    onRead?: (item: ThemeWithPermissions) => void;
    onUpdate?: (item: ThemeWithPermissions) => void;
    onDelete?: (item: ThemeWithPermissions) => void;
  }) => {
    const permissions = themeItem.permissions || {};

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
          border: themeItem.active
            ? `2px solid ${themeItem.accent.main}`
            : '1px solid rgba(0,0,0,0.1)',
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
            item={themeItem}
            permissions={permissions}
            onRead={onRead}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
          <Box sx={{ flex: 1, backgroundColor: themeItem.neutral2.main }} />
          <Box sx={{ flex: 1, backgroundColor: themeItem.neutral3.main }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: themeItem.neutral.main,
            p: 1.2,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: themeItem.neutral.content,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {themeItem.name}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
            {COLOR_KEYS.map((key) => {
              const color = (themeItem as any)[key];
              return (
                <Box
                  key={key}
                  sx={{
                    width: '16%',
                    height: 24,
                    borderRadius: '4px',
                    backgroundColor: color.main,
                    color: color.content,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  A
                </Box>
              );
            })}
          </Box>
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
          editorName="Theme Editor"
          editorItems={enrichedThemes}
          renderItem={(themeItem) => (
            <ThemeCard
              themeItem={themeItem}
              onRead={(t) => handleRead(t)}
              onUpdate={(t) => handleUpdate(t)}
              onDelete={(t) => handleDelete(t)}
            />
          )}
        />
      )}
    </>
  );
};

export default AdminThemePage;
