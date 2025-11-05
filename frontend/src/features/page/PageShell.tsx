import React from 'react';
import type { PageShellProps } from './pageTypes';
import Footer from '../footer/Footer';
import AnimBox from '../../components/pod/AnimBox';
import type { EntranceAnimation, ExitAnimation } from '../../components/pod/animBoxTypes';
import { useAppSelector } from '../../store/hooks';
import Home from '../home/Home';
import PageNotFound from '../pageNotFound/PageNotFound';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import { Box } from '@mui/material';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
  const activePage = useAppSelector((state) => state.activePage);

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
          sx={{ minHeight: 'calc(100vh - 64px)', p: 4 }}
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
