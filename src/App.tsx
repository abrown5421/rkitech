import React from 'react';
import { Box } from '@mui/material';
import BoxEditor from './features/theme/admin/boxEditor/BoxEditor';

const App: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 3, bgcolor: 'neutral3.main', color: 'neutral3.content', p: 2 }}>
        <BoxEditor />
      </Box>
      <Box sx={{ flex: 9, bgcolor: 'neutral.main', color: 'neutral.content', p: 2 }}>
        B
      </Box>
    </Box>
  );
};

export default App;
