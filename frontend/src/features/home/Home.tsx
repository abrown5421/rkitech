import React from 'react';
import { Box } from '@mui/material';
import { ElementRenderer } from '../elements/ElementRenderer';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
      }}
    >
      <ElementRenderer elementIds={['690cd8530c67842ae27ace7f']} />
    </Box>
  );
};

export default Home;
