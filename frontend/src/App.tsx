import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from './store/hooks';
import Renderer from './features/frontend/renderer/Renderer';
import TypographyEditor from './features/admin/typographyEditor/TypographyEditor';

const App: React.FC = () => {
  const rootElement = useAppSelector((state) => state.renderer.root);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 3, bgcolor: 'neutral3.main', color: 'neutral3.content', p: 2 }}>
        <TypographyEditor elementId="root" />
      </Box>
      <Box sx={{ flex: 9, bgcolor: 'neutral.main', color: 'neutral.content' }}>
        <Renderer element={rootElement} />
      </Box>
    </Box>
  );
};

export default App;
