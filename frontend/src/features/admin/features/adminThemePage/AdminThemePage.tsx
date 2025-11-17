import React from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import {
  useGetThemesQuery,
  useChangeActiveThemeMutation,
  useGetActiveThemeQuery,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
  useCreateThemeMutation,
} from '../../../theme/themeApi';
import type { ITheme } from '../../../theme/themeTypes';
import ColorPicker from '../../../../components/colorPicker/ColorPicker';
import {
  ALL_COLOR_KEYS,
  COLOR_KEYS,
  DEFAULT_THEME,
  type ColorKey,
} from './adminThemePageTypes';
import { EntityActionButtons } from '../../components/admin/EntityAction';
import { useAdminPageState } from '../../../../hooks/useAdminPageState';
import { useEntityEditor } from '../../../../hooks/useEntityEditor';
import { useCrudWithFeedback } from '../../../../hooks/useCrudWithFeedback';
import { useDeleteConfirmation } from '../../../../hooks/useDeleteConfirmation';
import { EditorActions } from '../../components/admin/EditorActions';
import { QueryStateHandler } from '../../components/admin/QueryStateHandler';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';

const ThemePreview: React.FC<{
  theme: Partial<ITheme>;
  activeTheme?: ITheme;
  isActive?: boolean;
  onActivate?: () => void;
}> = ({ theme, activeTheme, isActive, onActivate }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 1,
      position: 'relative',
      transition: 'all 0.2s ease-in-out',
      border: `1px solid ${activeTheme?.neutral.content}`,
    }}
  >
    {isActive !== undefined && (
      <Chip
        label={isActive ? 'Active' : 'Activate'}
        variant={isActive ? 'filled' : 'outlined'}
        clickable={!isActive}
        onClick={() => !isActive && onActivate?.()}
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: isActive ? activeTheme?.success.main : 'transparent',
          color: isActive ? activeTheme?.success.content : activeTheme?.neutral3.main,
          borderColor: isActive ? activeTheme?.success.content : activeTheme?.neutral3.main,
        }}
      />
    )}

    <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
      <Box sx={{ flex: 1, backgroundColor: theme.neutral2?.main }} />
      <Box sx={{ flex: 1, backgroundColor: theme.neutral3?.main }} />
    </Box>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: theme.neutral?.main,
        p: 1.2,
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.neutral?.content,
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      >
        {theme.name}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
        {COLOR_KEYS.map((key) => {
          const color = (theme as any)[key];
          return (
            <Box
              key={key}
              sx={{
                width: '16%',
                height: 24,
                borderRadius: '4px',
                backgroundColor: color?.main,
                color: color?.content,
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

const ColorGroupEditor: React.FC<{
  colorKey: ColorKey;
  colorGroup: { main: string; content: string };
  onChange: (key: ColorKey, type: 'main' | 'content', value: string) => void;
  activeTheme?: ITheme;
}> = ({ colorKey, colorGroup, onChange, activeTheme }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${activeTheme?.accent.main}`,
      p: 2,
      borderRadius: '5px',
    }}
  >
    <Typography sx={{ width: 100, textTransform: 'capitalize', mb: 2 }}>
      {colorKey}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
      <ColorPicker
        color={colorGroup.main}
        onChange={(newColor) => onChange(colorKey, 'main', newColor)}
        inputProps={{ label: 'Color' }}
        containerSx={{ flex: 1 }}
      />
      <ColorPicker
        color={colorGroup.content}
        onChange={(newColor) => onChange(colorKey, 'content', newColor)}
        inputProps={{ label: 'Contrast Color' }}
        containerSx={{ flex: 1 }}
      />
    </Box>
  </Box>
);

const ThemeCard: React.FC<{
  theme: ITheme;
  activeTheme?: ITheme;
  isLoading: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ theme, isLoading, onActivate, onEdit, onDelete }) => (
  <Box
    onClick={onActivate}
    sx={{
      display: 'flex',
      flexDirection: 'row',
      height: 80,
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 1,
      cursor: 'pointer',
      position: 'relative',
      border: theme.active ? `2px solid ${theme.accent.main}` : '1px solid rgba(0,0,0,0.1)',
      opacity: isLoading ? 0.6 : 1,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: 3,
      },
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
      <EntityActionButtons
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (e) => {
              e.stopPropagation();
              onEdit();
            },
          },
          {
            icon: 'delete',
            tooltip: 'Delete',
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
          },
        ]}
      />
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
      <Box sx={{ flex: 1, backgroundColor: theme.neutral2.main }} />
      <Box sx={{ flex: 1, backgroundColor: theme.neutral3.main }} />
    </Box>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: theme.neutral.main,
        p: 1.2,
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: theme.neutral.content,
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      >
        {theme.name}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
        {COLOR_KEYS.map((key) => {
          const color = (theme as any)[key];
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

const AdminThemePage: React.FC = () => {
  const { data: themes, isLoading, isError } = useGetThemesQuery();
  const { data: activeTheme } = useGetActiveThemeQuery();

  const [changeActiveTheme, { isLoading: isActivating }] = useChangeActiveThemeMutation();
  const [createTheme] = useCreateThemeMutation();
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();

  const { itemId, isCreating, isEditing, navigateToCreate, navigateToEdit, navigateToList } = useAdminPageState();

  const thisTheme = themes?.find((t) => t._id === itemId);

  const { entity, isChanged, handleChange, handleRevert } = useEntityEditor<ITheme>({
    defaultEntity: DEFAULT_THEME,
    currentEntity: thisTheme,
    isNew: isCreating,
  });

  const { executeWithFeedback } = useCrudWithFeedback();

  const handleThemeActivate = async (theme: ITheme) => {
    await executeWithFeedback(
      () => changeActiveTheme(theme._id ?? '').unwrap(),
      { successMessage: 'Theme activated successfully' }
    );
  };

  const handleThemeSave = async () => {
    if (!entity) return; 

    const mutation = isCreating
      ? () => createTheme(entity!).unwrap()
      : () => updateTheme({ id: itemId!, data: entity }).unwrap();

    await executeWithFeedback(mutation, {
      successMessage: 'Theme saved successfully',
    });
  };

  const { confirmDelete } = useDeleteConfirmation({
    onConfirm: async (id?: string) => {
      if (!id) return; 
      await executeWithFeedback(() => deleteTheme(id).unwrap(), {
        successMessage: 'Theme deleted successfully',
        onSuccess: navigateToList,
      });
    },
    canDelete: (id?: string) => {
      if (id === activeTheme?._id) {
        return {
          canDelete: false,
          reason: 'Unable to delete the currently active theme. Please activate a different theme first.',
        };
      }
      return true;
    },
    itemName: 'theme',
  });

  const handleColorChange = (key: ColorKey, type: 'main' | 'content', value: string) => {
    handleChange({
      ...entity,
      [key]: {
        ...(entity as any)[key],
        [type]: value,
      },
    });
  };

  const inputSx = {
    border: `1px solid ${activeTheme?.neutral.content}`,
    '& .MuiInputBase-input': { color: activeTheme?.neutral.content },
    '& .MuiInputLabel-root': {
      color: activeTheme?.neutral.content,
      backgroundColor: activeTheme?.neutral.main,
    },
  };

  if (isCreating || isEditing) {
    const isActive = !isCreating && entity?._id === activeTheme?._id;

    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'scroll' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 9 }}>
            <Typography variant="h6" sx={{ mb: 2, fontFamily: 'PrimaryFont' }}>
              {isCreating ? 'New Theme Editor' : `Editing ${entity?.name} Theme`}
            </Typography>
            {isCreating ? (
              <Typography variant="body1" sx={{ mb: 2 }}>
                A theme consists of nine color pairs: primary, secondary, accent, success, warning, error, neutral,
                neutral2, and neutral3. Each pair contains a main and contrasting content color.
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ mb: 2 }}>
                Theme ID: <strong>{entity?._id}</strong>
              </Typography>
            )}
            <TextField
              fullWidth
              size="small"
              label="Theme Name"
              variant="outlined"
              value={entity?.name || ''}
              onChange={(e) => handleChange({ ...entity, name: e.target.value })}
              sx={inputSx}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
            <ThemePreview
              theme={entity || {}}
              activeTheme={activeTheme}
              isActive={isActive}
              onActivate={() => handleThemeActivate(entity as ITheme)}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 4 }}>
          {ALL_COLOR_KEYS.map((key) => {
            const colorGroup = (entity as any)?.[key];
            if (!colorGroup) return null;

            return (
              <ColorGroupEditor
                key={key}
                colorKey={key}
                colorGroup={colorGroup}
                onChange={handleColorChange}
                activeTheme={activeTheme}
              />
            );
          })}
        </Box>

        <EditorActions
          isNew={isCreating}
          isChanged={isChanged}
          isSaving={isUpdating}
          onSave={handleThemeSave}
          onRevert={handleRevert}
          saveText="Save Theme"
          revertText="Revert Theme"
        />
      </Box>
    );
  }

  return (
    <QueryStateHandler isLoading={isLoading} isError={isError} data={themes}>
      <AdminPageLayout title="Theme Manager" onAddNew={navigateToCreate} addButtonText="Add New Theme">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2,
            boxSizing: 'border-box',
          }}
        >
          {themes
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((theme: ITheme) => (
              <ThemeCard
                key={theme._id || theme.name}
                theme={theme}
                activeTheme={activeTheme}
                isLoading={isActivating}
                onActivate={() => handleThemeActivate(theme)}
                onEdit={() => navigateToEdit(theme._id!)}
                onDelete={() => confirmDelete(theme._id)}
              />
            ))}
        </Box>
      </AdminPageLayout>
    </QueryStateHandler>
  );
};

export default AdminThemePage;