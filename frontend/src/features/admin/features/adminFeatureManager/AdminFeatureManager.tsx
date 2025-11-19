import { Box, Typography } from '@mui/material';
import type { AdminFeatureManagerProps } from './adminFeatureManagerTypes';

const AdminFeatureManager = <TItem,>({
  editorName,
  editorItems = [],
  renderItem,
}: AdminFeatureManagerProps<TItem>) => {
  return (
    <Box sx={{ width: '100%', p: 4, boxSizing: 'border-box' }}>
      <Typography variant="h6" sx={{ mb: 3, fontFamily: 'PrimaryFont' }}>
        {editorName}
      </Typography>
      <Box sx={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'flex-start', 
      }}>
        {editorItems.map((item, index) =>
          renderItem ? renderItem(item, index) : null
        )}
      </Box>
      
    </Box>
  );
};

export default AdminFeatureManager;
