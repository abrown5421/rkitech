import React, { useEffect } from 'react';
import type { PageShellProps } from './pageTypes';
import AnimBox from '../../components/animBox/AnimBox';
import { useAppSelector } from '../../store/hooks';
import Home from '../home/Home';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import { Box } from '@mui/material';
import { resolveThemeValue } from '../../hooks/useThemeValue';
import type { EntranceAnimation, ExitAnimation } from '../../components/animBox/animBoxTypes';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { ElementRenderer } from '../elements/ElementRenderer';
import AdminAuth from '../admin/features/adminAuth/AdminAuth';
import AdminDashboard from '../admin/features/adminDashboard/AdminDashboard';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../hooks/useNavigate';
import { useGetPagesQuery } from '../page/pageApi';
import type { IPage } from '../page/pageTypes';
import AdminSidebar from '../admin/features/adminSidebar/AdminSidebar';
import AdminNavPage from '../admin/features/adminNavPage/AdminNavPage';
import AdminFooterPage from '../admin/features/adminFooterPage/AdminFooterPage';
import AdminThemePage from '../admin/features/adminThemePage/AdminThemePage';
import AdminPagesPage from '../admin/features/adminPagesPage/AdminPagesPage';
import AdminPageEditor from '../admin/features/adminPageEditor/AdminPageEditor';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
  const activePage = useAppSelector((state) => state.activePage);
  const adminUser = useAppSelector((state) => state.adminUser.user);
  const location = useLocation();
  const { data: theme, isLoading: themeLoading } = useGetActiveThemeQuery();
  const { data: pages } = useGetPagesQuery();
  const navigate = useNavigation();

  const pageBgColor = resolveThemeValue(page.pageColor, theme);
  const pageFontColor = page.pageFontColor ? resolveThemeValue(page.pageFontColor, theme) : null;

  const isLoading = themeLoading || !theme;

  if (isLoading) {
    return null; 
  }

  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute && pages) {
      if (!adminUser) {
        const adminAuthPage = pages.find((p) => p.pageName === 'AdminAuthPage');
        if (adminAuthPage && activePage.activePageName !== 'AdminAuthPage') {
          navigate(adminAuthPage as IPage, false);
        }
      } else if (location.pathname.toLowerCase() === '/admin') {
        const dashboardPage = pages.find((p) => p.pageName === 'AdminDashPage');
        if (dashboardPage && activePage.activePageName !== 'AdminDashPage') {
          navigate(dashboardPage as IPage, false);
        }
      }
    }
  }, [isAdminRoute, adminUser, pages, activePage.activePageName, navigate]);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative', overflow: 'scroll', display: "flex", flexDirection: isAdminRoute ? "row" : "column" }}>
      {isAdminRoute && location.pathname !== '/admin/auth' && <AdminSidebar />}
      <AnimBox
        animationObject={{
          entranceAnimation: page.pageEntranceAnimation as EntranceAnimation,
          exitAnimation: page.pageExitAnimation as ExitAnimation,
          isEntering: activePage.activePageAnimateIn,
        }}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 10,
          zIndex: 1,
          width: '100%',
          backgroundColor: pageBgColor,
          color: pageFontColor ?? theme.neutral.content,
          fontFamily: page.pageFontFamily ?? 'SecondaryFont',
          boxSizing: 'border-box',
        }}
      >
        {page.pageRenderMethod === 'static' ? (
          <>
            {activePage.activePageName === 'Home' && <Home />}
            {activePage.activePageName === 'PrivacyPolicy' && <PrivacyPolicy />}

            {/* Admin routes (auto-protected above) */}
            {activePage.activePageName === 'AdminAuthPage' && <AdminAuth />}
            {activePage.activePageName === 'AdminDashPage' && <AdminDashboard />}
            {activePage.activePageName === 'AdminPagesPage' && <AdminPagesPage />}
            {activePage.activePageName === 'AdminNavPage' && <AdminNavPage />}
            {activePage.activePageName === 'AdminFooterPage' && <AdminFooterPage />}
            {activePage.activePageName === 'AdminThemePage' && <AdminThemePage />}
            {activePage.activePageName === 'AdminPageEditor' && <AdminPageEditor />}
          </>
        ) : (
          page.pageContent && <ElementRenderer elementIds={page.pageContent} />
        )}
      </AnimBox>
      {!isAdminRoute && (
        <ElementRenderer elementIds={['690e29f0f3f8484e3f4013b0']} />
      )}
    </Box>
  );
};

export default PageShell;