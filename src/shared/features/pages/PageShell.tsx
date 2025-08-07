

import React from 'react';
import type { PageShellState } from './pageTypes';
import Auth from '../../../client/features/auth/ClientAuth';
import Home from '../../../client/features/home/Home';
import Test from '../../../client/features/test/Test';
import Profile from '../../../client/features/profile/Profile';
import Dashboard from '../../../client/features/dashboard/Dashboard';
import Footer from '../../../client/features/footer/Footer';
import PageNotFound from '../../../client/features/pageNotFound/PageNotFound';
import PrivacyPolicy from '../../../client/features/privacyPolicy/PrivacyPolicy';
import TermsOfService from '../../../client/features/termsOfService/TermsOfService';
import { useAppSelector } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import AdminAuth from '../../../admin/features/auth/AdminAuth';
import AdminDashboard from '../../../admin/features/dashboard/AdminDashboard';
import Sidebar from '../../../admin/features/sidebar/Sidebar';

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
            <Container TwClassName="flex-row">
                {/* all of your static pages should have a conditional render statement below. If there is not one that static page will not show */}
                {activePage.activePageShellName === 'Home' && <Home />}
                {activePage.activePageShellName === 'Auth' && <Auth />}
                {activePage.activePageShellName === 'Test' && <Test />}
                {activePage.activePageShellName === 'Profile' && <Profile />}
                {activePage.activePageShellName === 'Dashboard' && <Dashboard />}
                {activePage.activePageShellName === 'Page Not Found' && <PageNotFound />}
                {activePage.activePageShellName === 'Privacy Policy' && <PrivacyPolicy />}
                {activePage.activePageShellName === 'Terms Of Service' && <TermsOfService />}

                {/* all of your admin pages should have a conditional render statement below. If there is not one that admin page will not show */}
                {activePage.activePageShellId === 'adminPage' && activePage.activePageShellName !== 'Admin' && <Sidebar />}
                {activePage.activePageShellName === 'Admin' && <AdminAuth />}
                {activePage.activePageShellName === 'AdminDash' && <AdminDashboard />}
            </Container>
            <Footer />
        </Container>
    );
};

export default PageShell;