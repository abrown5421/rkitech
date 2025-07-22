import React from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageTypes';
import { useAppSelector } from '../../app/hooks';
import Auth from '../auth/Auth';
import Home from '../home/Home';
import Test from '../test/Test';

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
            {/* all of your static pages should have a conditional render statement below. If there is not one that static page will not show */}
            {activePage.activePageShellName === 'Home' && <Home />}
            {activePage.activePageShellName === 'Auth' && <Auth />}
            {activePage.activePageShellName === 'Test' && <Test />}
        </Container>
    );
};

export default PageShell;
 