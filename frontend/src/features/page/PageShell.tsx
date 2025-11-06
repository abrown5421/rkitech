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
import { ElementRenderer } from '../elements/ElementRenderer';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
  const activePage = useAppSelector((state) => state.activePage);
  const { data: theme, isLoading: themeLoading } = useGetActiveThemeQuery();
  const pageBgColor = useThemeValue(page.pageColor);
  const pageFontColor = page.pageFontColor ? useThemeValue(page.pageFontColor) : null;
  
  if (themeLoading || !theme) {
    return null; 
  }

  useEffect(()=>{console.log(page)}, [page])

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
          sx={{ 
            position: 'relative',
            zIndex: 1,
            width: '100%', 
            minHeight: 'calc(100vh - 64px)', 
            backgroundColor: pageBgColor,
            color: pageFontColor ?? theme.neutral.content,
            fontFamily: page.pageFontFamily ?? 'SecondaryFont',
            boxSizing: 'border-box',
            p: 4
          }}
        >
          {activePage.activePageName === 'Home' && <Home />}
          {activePage.activePageName === 'PageNotFound' && <PageNotFound />}
          {activePage.activePageName === 'PrivacyPolicy' && <PrivacyPolicy />}
        </AnimBox>
      ) : (
        page.pageContent && <ElementRenderer elementIds={page.pageContent} />
      )}

      <Footer />
    </Box>
  );
};

export default PageShell;