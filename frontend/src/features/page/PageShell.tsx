import React, { useEffect } from 'react';
import type { PageShellProps } from './pageTypes';
import Footer from '../footer/Footer';
import AnimBox from '../../components/animBox/AnimBox';
import { useAppSelector } from '../../store/hooks';
import Home from '../home/Home';
import PageNotFound from '../pageNotFound/PageNotFound';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import { Box } from '@mui/material';
import { useThemeValue } from '../../hooks/useThemeValue';
import type { EntranceAnimation, ExitAnimation } from '../../components/animBox/animBoxTypes';
import { useGetActiveThemeQuery } from '../theme/themeApi';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
  const activePage = useAppSelector((state) => state.activePage);
  const { data: theme, isLoading: themeLoading } = useGetActiveThemeQuery();
  const pageBgColor = useThemeValue(page.pageColor);

  useEffect(()=>{
    console.log('page.pageColor:', page.pageColor);
    console.log('pageBgColor:', pageBgColor);
    console.log('Full theme object:', theme); // ADD THIS
    console.log('Theme keys:', theme ? Object.keys(theme) : 'no theme'); // ADD THIS
  }, [page.pageColor, pageBgColor, theme])
  
  if (themeLoading || !theme) {
    return null; 
  }

  return (
    <Box
      sx={{
        overflow: 'auto',
      }}
    >
      {page.pageRenderMethod === 'static' ? (
        <AnimBox
          animationObject={{
            entranceAnimation: page.pageEntranceAnimation as EntranceAnimation,
            exitAnimation: page.pageExitAnimation as ExitAnimation,
            isEntering: activePage.activePageAnimateIn,
          }}
          sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', backgroundColor: pageBgColor}}
        >
          {activePage.activePageName === 'Home' && <Home />}
          {activePage.activePageName === 'PageNotFound' && <PageNotFound />}
          {activePage.activePageName === 'PrivacyPolicy' && <PrivacyPolicy />}
        </AnimBox>
      ) : (
        <AnimBox>dynamic</AnimBox>
      )}

      <Footer />
    </Box>
  );
};

export default PageShell;