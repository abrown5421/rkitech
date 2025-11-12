import React from 'react';
import { Box } from '@mui/material';

const AdminDashboard: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: "calc(100vh - 128px)",
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      dashboard
    </Box>
  );
};

export default AdminDashboard;
