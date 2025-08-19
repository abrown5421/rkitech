
import React, { useEffect, useState } from 'react';
import type { PageShellState, PagesShellSubState } from './pageTypes';
import Auth from '../../../client/features/auth/ClientAuth';
import Home from '../../../client/features/home/Home';
import Profile from '../../../client/features/profile/Profile';
import Dashboard from '../../../client/features/dashboard/Dashboard';
import Footer from '../../../client/features/footer/Footer';
import PageNotFound from '../../../client/features/pageNotFound/PageNotFound';
import PrivacyPolicy from '../../../client/features/privacyPolicy/PrivacyPolicy';
import TermsOfService from '../../../client/features/termsOfService/TermsOfService';
import { useAppSelector } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import Sidebar from '../../../admin/features/sidebar/Sidebar';
import AdminRoutes from '../../../admin/features/adminRoutes/AdminRoutes';
import Blog from '../../../client/features/blog/Blog';
import BlogPost from '../../../client/features/blog/BlogPost';
import Loader from '../../components/loader/Loader';
import Staff from '../../../client/features/staff/Staff';
import Gallery from '../../../client/features/gallery/Gallery';
import PageContentRenderer from './PageContentRenderer';

const PageShell: React.FC<PageShellState> = ({
    activePageShellBgColor = 'bg-white', 
    activePageShellAnimation = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true,
    }
}) => {
    const activePage = useAppSelector((state) => state.pageShell);
    const pages = useAppSelector((state) => state.pages);
    const [localPage, setLocalPage] = useState<PagesShellSubState | undefined>({
        localPageRef: 'HomeComp',
        localPageType: 'static',
        localPageContent: []
    });

    useEffect(()=>{
        if (activePage.activePageShellId !== 'adminPage') {
            const findRef = pages.pages.find((page) => page.pageID === activePage.activePageShellId)
            
            setLocalPage({
                localPageRef: findRef?.componentKey,
                localPageType: (findRef?.pageRenderMethod as 'static' | 'dynamic') ?? 'static',
                localPageContent: findRef?.content
            })
        }
    }, [activePage])

    useEffect(()=>{console.log(localPage)}, [localPage])

    return (
        <Container TwClassName="flex-row">
            {activePage.activePageShellId === 'adminPage' && activePage.activePageShellName !== 'Admin' && (
                <Sidebar />
            )}
            
            <Container
                TwClassName={`${activePageShellBgColor} flex-col flex-10 h-[calc(100vh-50px)] overflow-scroll`}
                animation={{ entranceExit: activePageShellAnimation }}
            >
                {activePage.activePageShellId === 'adminPage' ? (
                    <AdminRoutes />                
                ) : (
                    <Container TwClassName="flex-col flex-1">
                        
                        {localPage?.localPageType === 'static' ? (
                            <Container TwClassName="flex-col flex-1">
                                {localPage?.localPageRef === 'HomeComp' && <Home />}
                                {localPage?.localPageRef === 'LoginComp' && <Auth />}
                                {localPage?.localPageRef === 'SignUpComp' && <Auth />}
                                {localPage?.localPageRef === 'BlogComp' && <Blog />}
                                {localPage?.localPageRef === 'StaffComp' && <Staff />}
                                {localPage?.localPageRef === 'GalleryComp' && <Gallery />}
                                {localPage?.localPageRef === 'blogPostComp' && <BlogPost />}
                                {localPage?.localPageRef === 'ProfileComp' && <Profile />}
                                {localPage?.localPageRef === 'DashboardComp' && <Dashboard />}
                                {localPage?.localPageRef === 'PageNotFoundComp' && <PageNotFound />}
                                {localPage?.localPageRef === 'PrivacyPolicyComp' && <PrivacyPolicy />}
                                {localPage?.localPageRef === 'TermsOfServiceComp' && <TermsOfService />}
                            </Container>
                        ) : (
                            <PageContentRenderer content={localPage?.localPageContent} />
                        )}
                        <Footer />
                    </Container>
                )}
            </Container>
            
            <Container TwClassName='absolute top-[50px] w-full h-[calc(100vh-50px)] pl-4 pr-4 -z-10' 
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeIn animate_faster',
                        exitAnimation: 'animate__fadeOut animate_faster',
                        isEntering: !activePage.activePageShellIn && activePage.activePageShellId === 'adminPage',
                    },
                }}
            >
                <Container TwClassName='flex-col flex-2 bg-transparent'>
                    &nbsp;
                </Container>
                <Container TwClassName='flex-col flex-10 justify-center items-center pl-4 pr-4 h-full w-full'>
                    <Loader variant='spinner' color='text-amber-500' />
                </Container>
            </Container>
        </Container>
    );
};

export default PageShell;