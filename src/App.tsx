import React from 'react';
import { Box } from '@mui/material';
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
          Live Box Preview
        </Box>
      </Box>
    </Box>
  );
};

export default App;
