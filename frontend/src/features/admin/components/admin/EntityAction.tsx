import React from 'react';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

export interface EntityAction {
  icon: 'edit' | 'settings' | 'delete' | 'view' | 'custom';
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
  show?: boolean;
  isLoading?: boolean;
  customIcon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'success';
}

interface EntityActionButtonsProps {
  actions: EntityAction[];
}

export const EntityActionButtons: React.FC<EntityActionButtonsProps> = ({ actions }) => {
  const { data: theme } = useGetActiveThemeQuery();

  const iconMap = {
    edit: EditIcon,
    settings: SettingsIcon,
    delete: TrashIcon,
    view: RemoveRedEyeIcon,
  };

  const colorMap = {
    primary: theme?.primary.main,
    secondary: theme?.secondary.main,
    error: theme?.error.main,
    success: theme?.success.main,
  };

  const defaultColorMap = {
    edit: theme?.primary.main,
    settings: theme?.secondary.main,
    delete: theme?.error.main,
    view: theme?.success.main,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {actions
        .filter((action) => action.show !== false)
        .map((action, index) => {
          const Icon = action.icon !== 'custom' ? iconMap[action.icon] : null;
          const color =
            action.color
                ? colorMap[action.color]
                : action.icon === "custom"
                ? theme?.primary.main
                : defaultColorMap[action.icon];

          return (
            <Tooltip key={index} title={action.tooltip}>
              <IconButton
                onClick={action.onClick}
                sx={{
                  color,
                  border: '1px solid transparent',
                  '&:hover': { borderColor: color },
                }}
              >
                {action.isLoading ? (
                  <CircularProgress sx={{ color }} size={16} />
                ) : action.icon === 'custom' ? (
                  action.customIcon
                ) : (
                  Icon && <Icon />
                )}
              </IconButton>
            </Tooltip>
          );
        })}
    </Box>
  );
};