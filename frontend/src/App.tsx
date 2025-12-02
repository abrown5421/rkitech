import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from './store/hooks';
import Renderer from './features/frontend/renderer/Renderer';
import TypographyEditor from './features/admin/typographyEditor/TypographyEditor';
import { useCheckHealth } from './hooks/useCheckHealth';
import Healthy from './features/frontend/health/Healthy';
import Unhealthy from './features/frontend/health/Unhealthy';

const App: React.FC = () => {
  const rootElement = useAppSelector((state) => state.renderer.root);
  const { loading, error, progress } = useCheckHealth();
  
  if (loading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }

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
