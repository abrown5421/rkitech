import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { useCheckHealth } from './hooks/useCheckHealth';
import Healthy from './features/frontend/health/Healthy';
import Unhealthy from './features/frontend/health/Unhealthy';
import theme from './features/theme/theme';
import Page from './features/frontend/page/Page';

const App: React.FC = () => {
  const { loading, error, progress, pages } = useCheckHealth();
  
  if (loading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100vw'
      height='100vh'
      bgcolor={theme.palette.neutral.content}
    >
      <Routes>
        {pages.map((p) => (
          <Route
            key={p._id}
            path={p.pagePath}
            element={<Page page={p} />}
          />
        ))}
        <Route path="*" element={<Page page={{...pages.find(p => p.pageName === 'PageNotFound')!}} />} />
      </Routes>
    </Box>
  );
};

export default App;
