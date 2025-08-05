import React from 'react';
import type { PageShellState } from './pageTypes';
import Auth from '../auth/Auth';
import Home from '../home/Home';
import Test from '../test/Test';
import Profile from '../profile/Profile';
import Dashboard from '../dashboard/Dashboard';
import Footer from '../footer/Footer';
import PageNotFound from '../pageNotFound/PageNotFound';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import TermsOfService from '../termsOfService/TermsOfService';
import { useAppSelector } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';

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
            TwClassName={`${activePageShellBgColor} flex-col h-[calc(100vh-50px)] flex flex-col overflow-scroll`}
            animation={{
                entranceExit: activePageShellAnimation,
            }}
        >
            <Container TwClassName="">
                {/* all of your static pages should have a conditional render statement below. If there is not one that static page will not show */}
                {activePage.activePageShellName === 'Home' && <Home />}
                {activePage.activePageShellName === 'Auth' && <Auth />}
                {activePage.activePageShellName === 'Test' && <Test />}
                {activePage.activePageShellName === 'Profile' && <Profile />}
                {activePage.activePageShellName === 'Dashboard' && <Dashboard />}
                {activePage.activePageShellName === 'Page Not Found' && <PageNotFound />}
                {activePage.activePageShellName === 'Privacy Policy' && <PrivacyPolicy />}
                {activePage.activePageShellName === 'Terms Of Service' && <TermsOfService />}
            </Container>
            <Footer />
        </Container>
    );
};

export default PageShell;