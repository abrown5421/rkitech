import React from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageShellTypes';
import { useAppSelector } from '../../app/hooks';
import Auth from '../auth/Auth';
import Home from '../home/Home';

const PageShell: React.FC<PageShellState> = ({
    activePageShellBgColor = 'bg-white', 
    activePageShellAnimation = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true,
    }
}) => {
    const activePage = useAppSelector((state) => state.pageShell);

    return (
        <Container 
            padding='md' 
            bgColor={activePageShellBgColor}
            className={`relative z-20 h-[calc(100vh-50px)]`}
            animation={{
                entranceExit: activePageShellAnimation,
            }}
        >
            {activePage.activePageShellName === 'Home' && <Home />}
            {activePage.activePageShellName === 'Auth' && <Auth />}
        </Container>
    );
};

export default PageShell;
 