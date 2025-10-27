import React from 'react';
import type { PageShellProps } from './pageTypes';
import Footer from '../footer/Footer';
import Pod from '../../components/pod/Pod';
import type { EntranceAnimation, ExitAnimation } from '../../components/pod/podTypes';
import { useAppSelector } from '../../store/hooks'; 
import Home from '../home/Home';

const PageShell: React.FC<PageShellProps> = ({ page }) => {
    const activePage = useAppSelector((state) => state.activePage)

    return (
        <Pod className='overflow-scroll hide-sb'>
            {page.pageRenderMethod === 'static' ? (
                <Pod 
                  animationObject={{
                    entranceAnimation: page.pageEntranceAnimation as EntranceAnimation,
                    exitAnimation: page.pageExitAnimation as ExitAnimation,
                    isEntering: activePage.activePageAnimateIn
                  }} 
                  className='page-body p-4'
                >
                    {activePage.activePageName === 'Home' && <Home />}
                </Pod>
            ) : (
                <Pod>dynamic</Pod>
            )}
            <Footer />
        </Pod>
    );
};
export default PageShell;