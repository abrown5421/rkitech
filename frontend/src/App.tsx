import React from 'react';
import Navbar from './features/navbar/Navbar';
import { usePreloadData } from './hooks/usePreloadData';
import PageShell from './features/page/PageShell';
import { Route, Routes } from 'react-router-dom';
import Healthy from './features/health/Healthy';
import Unhealthy from './features/health/Unhealthy';

const App: React.FC = () => {
  const { loading, error, pages, progress } = usePreloadData();

  if (loading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <Routes>
        {pages.map((p) => (
          <Route
            key={p._id}
            path={p.pagePath}
            element={<PageShell page={p} />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default App;
