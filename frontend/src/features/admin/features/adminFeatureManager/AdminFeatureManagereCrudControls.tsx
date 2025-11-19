import { IconButton, Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CrudControlsProps } from './adminFeatureManagerTypes';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

const AdminFeatureManagereCrudControls = <TItem,>({
  item,
  permissions,
  specialAction,
  onSpecialAction,
  onRead,
  onUpdate,
  onDelete,
}: CrudControlsProps<TItem>) => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <Box sx={{ display: 'flex' }}>
      {permissions?.onSpecialAction && (
        <Tooltip title={specialAction?.title}>
          <IconButton
            size="small"
            onClick={() => onSpecialAction?.(item)}
            sx={{ color: specialAction?.color }}
          >
            {specialAction?.icon}
          </IconButton>
        </Tooltip>
      )}

      {permissions?.read && (
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={() => onRead?.(item)}
            sx={{ color: theme?.success?.main }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {permissions?.update && (
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => onUpdate?.(item)}
            sx={{ color: theme?.warning?.main }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {permissions?.delete && (
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => onDelete?.(item)}
            sx={{ color: theme?.error?.main }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default AdminFeatureManagereCrudControls;
