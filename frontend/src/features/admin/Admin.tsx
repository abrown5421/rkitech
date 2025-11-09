import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useGetActiveThemeQuery } from '../theme/themeApi';

const Admin: React.FC = () => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        backgroundColor: theme?.neutral.content,
      }}
    >
      <Box
        sx={{
            flex: 1, 
            display: 'flex',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Admin;
