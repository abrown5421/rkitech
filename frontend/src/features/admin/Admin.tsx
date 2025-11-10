import React from 'react';
import { Box } from '@mui/material';

const Admin: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
      }}
    >
      Admin
    </Box>
  );
};

export default Admin;
