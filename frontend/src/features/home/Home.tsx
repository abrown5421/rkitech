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
      <ElementRenderer elementIds={['690cd5710c67842ae27ace74']} />
    </Box>
  );
};

export default Home;
