import React, { useEffect } from 'react';
import Navbar from './features/navbar/Navbar';
import { usePreloadData } from './hooks/usePreloadData';
import PageShell from './features/page/PageShell';
import { matchPath, Route, Routes, useLocation } from 'react-router-dom';
import Healthy from './features/health/Healthy';
import Unhealthy from './features/health/Unhealthy';
import Pod from './components/pod/Pod';
import { useAppDispatch } from './store/hooks';
import { setActivePage } from './features/page/activePageSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { loading, error, pages, configs, progress } = usePreloadData();

  useEffect(() => {
    if (!pages || pages.length === 0) return;

    const page = pages.find(p =>
      matchPath({ path: p.pagePath, end: true }, location.pathname)
    );

    const pageNotFound = pages.find((p) => p.pageName === 'PageNotFound');

    if (page) {
      dispatch(setActivePage({activePageName: page.pageName, activePageAnimateIn: true}));
    } else if (pageNotFound) {
      dispatch(setActivePage({activePageName: pageNotFound.pageName, activePageAnimateIn: true}));
    }
  }, [dispatch, pages, location.pathname]);

  if (loading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }
  
  return (
    <Pod className="flex flex-col w-screen h-screen">
      <Navbar configs={configs} loading={loading} />
      <Routes>
        {pages.map((p) => (
          <Route
            key={p._id}
            path={p.pagePath}
            element={<PageShell page={p} />}
          />
        ))}
        <Route path="*" element={<PageShell page={{...pages.find(p => p.pageName === 'PageNotFound')!}} />} />
      </Routes>
    </Pod>
  );
};

export default App;
