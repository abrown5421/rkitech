import React from 'react';
import Container from '../../shared/components/container/Container';
import Auth from '../../features/auth/auth';
import type { PageShellState } from './pageShellTypes';
import { useAppSelector } from '../../app/hooks';

const PageShell: React.FC<PageShellState> = ({
    pageShellRenderMethod = 'dynamic',
    pageShellBackgroundColor = 'bg-white',
    pageShellAnimation = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true,
    }
}) => {
    const activePage = useAppSelector((state) => state.pageShell);

    return (
        <Container 
            padding='md' 
            className={`${pageShellBackgroundColor} z-20 h-[calc(100vh-50px)]`}
            animation={{
                entranceExit: {
                    entranceAnimation: pageShellAnimation.entranceAnimation,
                    exitAnimation: pageShellAnimation.exitAnimation,
                    isEntering: pageShellAnimation.isEntering,
                },
            }}
        >
            {pageShellRenderMethod === 'static' && activePage.activePageName === 'Auth' && <Auth />}
        </Container>
    );
};

export default PageShell;
