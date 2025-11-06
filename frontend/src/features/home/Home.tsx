import React from 'react';
import { Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 50px)',
        width: '100%',
        boxSizing: 'border-box',
        p: 4
      }}
    >
      Home
    </Box>
  );
};

export default Home;
