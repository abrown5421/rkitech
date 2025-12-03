import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Healthy from './features/frontend/health/Healthy';
import Unhealthy from './features/frontend/health/Unhealthy';
import Page from './features/frontend/page/Page';
import { useAppDispatch } from './store/hooks';
import { setActivePage } from './features/frontend/page/pageSlice';
import Navbar from './features/admin/navbar/Navbar';
import { useCheckHealth } from './features/frontend/health/useCheckHealth';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { loading, error, progress, pages, theme } = useCheckHealth();
  const pageNotFound = pages.find((p) => p.pageUniqueId === 'page_id_page_not_found');
  
  useEffect(()=>{
    if (!pages || pages.length === 0) return;

    const page = pages.find((p) => p.pagePath === location.pathname)

    if (page) {
      dispatch(setActivePage({
        activePageUid: page.pageUniqueId,
        activePageAnimateIn: true,
        activePageObj: page
      }))
    } else if (pageNotFound) {
      dispatch(
        setActivePage({
          activePageUid: pageNotFound.pageUniqueId,
          activePageAnimateIn: true,
          activePageObj: pageNotFound, 
        })
      );
    }
  }, [pages, location])

  if (!pages || pages.length === 0 || !pageNotFound) return;
  
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
      {(() => {
        const path = location.pathname.toLowerCase();

        if (path === "/admin/auth") {
          return null;
        } else if (path.startsWith("/admin")) {
          return <Navbar />;
        }
      })()}
      <Routes>
        {pages.map((p) => (
          <Route
            key={p._id}
            path={p.pagePath}
            element={<Page page={p} />}
          />
        ))}
        <Route path="*" element={<Page page={pageNotFound} />} />
      </Routes>
    </Box>
  );
};

export default App;
