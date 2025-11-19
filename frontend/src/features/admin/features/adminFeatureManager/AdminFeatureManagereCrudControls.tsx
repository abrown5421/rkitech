import { IconButton, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CrudControlsProps } from './adminFeatureManagerTypes';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

const AdminFeatureManagereCrudControls = <TItem,>({
  item,
  permissions,
  onRead,
  onUpdate,
  onDelete,
}: CrudControlsProps<TItem>) => {
  const {data: theme} = useGetActiveThemeQuery();
  return (
    <Box sx={{ display: 'flex' }}>
      {permissions?.read && (
        <IconButton
          size="small"
          onClick={() => onRead?.(item)}
          sx={{ color: theme?.success?.main }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      )}
      {permissions?.update && (
        <IconButton size="small" onClick={() => onUpdate?.(item)} sx={{ color: theme?.warning?.main }}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
      {permissions?.delete && (
        <IconButton size="small" onClick={() => onDelete?.(item)} sx={{ color: theme?.error?.main }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default AdminFeatureManagereCrudControls;
