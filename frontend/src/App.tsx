import React from 'react';
import Navbar from './features/navbar/Navbar';
import { usePreloadData } from './hooks/usePreloadData';
import PageShell from './features/page/PageShell';
import { Route, Routes } from 'react-router-dom';
import Healthy from './features/health/Healthy';
import Unhealthy from './features/health/Unhealthy';
import Pod from './components/pod/Pod';

const App: React.FC = () => {
  const { loading, error, pages, progress } = usePreloadData();

  if (loading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }

  return (
    <Pod className="flex flex-col w-screen h-screen">
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
    </Pod>
  );
};

export default App;
