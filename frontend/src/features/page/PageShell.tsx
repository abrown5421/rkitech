import React, { useEffect } from 'react';
import type { PageShellProps } from './pageTypes';
import AnimBox from '../../components/animBox/AnimBox';
import { useAppSelector } from '../../store/hooks';
import Home from '../home/Home';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import { Box } from '@mui/material';
import { useThemeValue } from '../../hooks/useThemeValue';
import type { EntranceAnimation, ExitAnimation } from '../../components/animBox/animBoxTypes';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { ElementRenderer } from '../elements/ElementRenderer';
import Admin from '../admin/Admin';
import AdminAuth from '../admin/features/adminAuth/AdminAuth';
import AdminDashboard from '../admin/features/adminDashboard/AdminDashboard';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../hooks/useNavigate';
import { useGetPagesQuery } from '../page/pageApi';
import type { IPage } from '../page/pageTypes';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
  const activePage = useAppSelector((state) => state.activePage);
  const adminUser = useAppSelector((state) => state.adminUser.user);
  const location = useLocation();
  const { data: theme, isLoading: themeLoading } = useGetActiveThemeQuery();
  const { data: pages } = useGetPagesQuery();
  const navigate = useNavigation();

  const pageBgColor = useThemeValue(page.pageColor);
  const pageFontColor = page.pageFontColor ? useThemeValue(page.pageFontColor) : null;

  const isLoading = themeLoading || !theme;

  if (isLoading) {
    return null; 
  }

  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');

  useEffect(() => {
    if (
      isAdminRoute &&
      !adminUser &&
      activePage.activePageName !== 'AdminAuthPage' &&
      pages
    ) {
      const adminAuthPage = pages.find((p) => p.pageName === 'AdminAuthPage');
      if (adminAuthPage) {
        navigate(adminAuthPage as IPage, false);
      }
    }
  }, [isAdminRoute, adminUser, activePage.activePageName, pages, navigate]);

  return (
    <Box sx={{ overflow: 'auto' }}>
      <AnimBox
        animationObject={{
          entranceAnimation: page.pageEntranceAnimation as EntranceAnimation,
          exitAnimation: page.pageExitAnimation as ExitAnimation,
          isEntering: activePage.activePageAnimateIn,
        }}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: pageBgColor,
          color: pageFontColor ?? theme.neutral.content,
          fontFamily: page.pageFontFamily ?? 'SecondaryFont',
          boxSizing: 'border-box',
          p: 4,
        }}
      >
        {page.pageRenderMethod === 'static' ? (
          <>
            {activePage.activePageName === 'Home' && <Home />}
            {activePage.activePageName === 'PrivacyPolicy' && <PrivacyPolicy />}

            {/* Admin routes (auto-protected above) */}
            {activePage.activePageName === 'AdminRootPage' && <Admin />}
            {activePage.activePageName === 'AdminAuthPage' && <AdminAuth />}
            {activePage.activePageName === 'AdminDashPage' && <AdminDashboard />}
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