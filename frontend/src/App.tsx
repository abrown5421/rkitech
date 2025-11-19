import React, { useEffect } from 'react';
import { usePreloadData } from './hooks/usePreloadData';
import PageShell from './features/page/PageShell';
import { matchPath, Route, Routes, useLocation } from 'react-router-dom';
import Healthy from './features/health/Healthy';
import Unhealthy from './features/health/Unhealthy';
import { useAppDispatch } from './store/hooks';
import { setActivePage } from './features/page/activePageSlice';
import { Box } from '@mui/material';
import { ElementRenderer } from './features/elements/ElementRenderer';
import Alert from './features/alert/Alert';
import Modal from './features/modal/Modal';
import Drawer from './features/drawer/Drawer';
import AdminNavbar from './features/admin/features/adminNavbar/AdminNavbar';
import { MuiStyleOverider } from './MuiStyleOverider';
import { useAdminAuthFromCookie } from './features/admin/hooks/useAdminAuthFromCookie';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { loading, error, pages, theme, progress } = usePreloadData();
  
  const cookieLoading = useAdminAuthFromCookie();

  useEffect(() => {
    if (!pages || pages.length === 0) return;

    const page = pages.find((p) =>
      matchPath({ path: p.pagePath, end: true }, location.pathname)
    );

    const pageNotFound = pages.find((p) => p.pageName === 'PageNotFound');

    if (page) {
      dispatch(
        setActivePage({
          activePageName: page.pageName,
          activePageAnimateIn: true,
          activePageObj: page,
        })
      );
    } else if (pageNotFound) {
      dispatch(
        setActivePage({
          activePageName: pageNotFound.pageName,
          activePageAnimateIn: true,
          activePageObj: pageNotFound, 
        })
      );
    }
  }, [dispatch, pages, location.pathname]);

  if (loading || cookieLoading) {
    return <Healthy progress={progress} />;
  }

  if (error) {
    return <Unhealthy error={error} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: theme?.neutral?.content || '#1A1D27'
      }}
    >
      {(() => {
        const path = location.pathname.toLowerCase();

        if (path === "/admin/auth") {
          return null;
        } else if (path.startsWith("/admin")) {
          return <AdminNavbar />;
        } else {
          return <ElementRenderer elementIds={["690d2f77f96d2590ee5adc64"]} />;
        }
      })()}
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
      <Alert />
      <Modal />
      <Drawer />
      <MuiStyleOverider />
    </Box>
  );
};

export default App;