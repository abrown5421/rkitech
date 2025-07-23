import React from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageTypes';
import { useAppSelector } from '../../app/hooks';
import Auth from '../auth/Auth';
import Home from '../home/Home';
import Test from '../test/Test';
import Profile from '../profile/Profile';
import Dashboard from '../dashboard/Dashboard';
import Footer from '../footer/Footer';
import PageNotFound from '../pageNotFound/PageNotFound';

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
            bgColor={activePageShellBgColor}
            flexDirection='col'
            className="h-[calc(100vh-50px)] flex flex-col overflow-scroll"
            animation={{
                entranceExit: activePageShellAnimation,
            }}
        >
            <div className="min-h-[calc(100vh-50px)]">
                {/* all of your static pages should have a conditional render statement below. If there is not one that static page will not show */}
                {activePage.activePageShellName === 'Home' && <Home />}
                {activePage.activePageShellName === 'Auth' && <Auth />}
                {activePage.activePageShellName === 'Test' && <Test />}
                {activePage.activePageShellName === 'Profile' && <Profile />}
                {activePage.activePageShellName === 'Dashboard' && <Dashboard />}
<<<<<<< HEAD
                {activePage.activePageShellName === 'Page Not Found' && <PageNotFound />}
=======
                {activePage.activePageShellName === 'PageNotFound' && <PageNotFound />}
>>>>>>> 11c775f5de46e4b7f08f53351250a52c0109f1ed
            </div>
            <Footer />
        </Container>
    );
};

export default PageShell;