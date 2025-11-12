import React from 'react';
import { Box, Typography } from '@mui/material';
import { useGetPagesQuery } from '../../../page/pageApi';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

const AdminPages: React.FC = () => {
  const { data: pages, isLoading, isError } = useGetPagesQuery();
  const { data: theme } = useGetActiveThemeQuery();

  if (isLoading) return <Typography sx={{ p: 4 }}>Loading pages...</Typography>;
  if (isError || !pages) return <Typography sx={{ p: 4 }}>Failed to load pages.</Typography>;

  const filteredPages = pages.filter(
    (page) => !page.pagePath?.toLowerCase().startsWith('/admin')
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: 'calc(100vh - 64px)',
        overflow: 'scroll',
        width: '100%',
        boxSizing: 'border-box',
        p: 4,
      }}
    >
      {filteredPages.map((page) => (
        <Box
          key={page._id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            border: `2px solid ${theme?.neutral3.main}`,
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'SecondaryFont' }}>
            {page.pageName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {page.pagePath}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AdminPages;
