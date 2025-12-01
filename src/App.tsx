import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from './store/hooks';
import BoxEditor from './features/admin/boxEditor/BoxEditor';

const App: React.FC = () => {
  const boxProps = useAppSelector((state) => state.boxEditor);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 3, bgcolor: 'neutral3.main', color: 'neutral3.content', p: 2 }}>
        <BoxEditor />
      </Box>
      <Box sx={{ flex: 9, bgcolor: 'neutral.main', color: 'neutral.content' }}>
        <Box {...boxProps}>
          <Typography>A</Typography>
          <Typography>B</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
