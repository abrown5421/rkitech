import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './shared/components/loader/Loader';
import Container from './shared/components/container/Container';
import Navbar from './client/features/navbar/Navbar';
import AdminNavbar from './admin/features/navbar/AdminNavbar';
import PageShell from './shared/features/pages/PageShell';
import Modal from './shared/features/modal/Modal';
import Alert from './shared/features/alert/Alert';
import Drawer from './shared/features/drawer/Drawer';

import { setPartOfActivePageShell } from './shared/features/pages/pageShellSlice';
import { setHomePageId, setHomePageObj } from './app/globalSlices/homePageId/homePageIdSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initializeApp = useInitializeApp();
  const activePage = useAppSelector((s) => s.pageShell);
  const adminAuthUser = useAppSelector((s) => s.adminAuthUser);
  const pages = useAppSelector((s) => s.pages.pages);
  const authUser = useAppSelector((s) => s.authUser);

  const [loadingSite, setLoadingSite] = useState(true);

  const setShell = (name: string, id: string) => {
    dispatch(setPartOfActivePageShell({ key: 'activePageShellName', value: name }));
    dispatch(setPartOfActivePageShell({ key: 'activePageShellId', value: id }));
    dispatch(setPartOfActivePageShell({ key: 'activePageShellIn', value: true }));
  };

  useEffect(()=>{console.log(activePage)}, [activePage])

  useEffect(() => {
    const parseCookie = (key: string) => {
      const val = Cookies.get(key);
      return val ? JSON.parse(val) : null;
    };

    const unsubscribe = initializeApp(
      parseCookie('authUser'),
      parseCookie('adminAuthUser'),
      () => setLoadingSite(false)
    );

    return () => unsubscribe?.();
  }, [authUser.user?.userId, adminAuthUser.user?.userId]);

  useEffect(() => {
    if (!pages.length) return;

    const homePage = pages.find((p) => p.componentKey === 'HomeComp');
    const profilePage = pages.find((p) => p.componentKey === 'ProfileComp');
    const blogPostPage = pages.find((p) => p.componentKey === 'blogPostComp');
    const notFoundPage = pages.find((p) => p.componentKey === 'PageNotFoundComp');

    const pathname = location.pathname.toLowerCase();

    if (homePage?.pageID) {
      dispatch(setHomePageId(homePage.pageID));
      dispatch(setHomePageObj(homePage));
    }

    if (pathname === '/admin') return setShell('Admin', 'adminPage');
    if (pathname.startsWith('/admin/')) return setShell('AdminDash', 'adminPage');

    if (pathname === homePage?.pagePath) return setShell(homePage.pageName, homePage.pageID);

    const pageRef = pages.find((p) => {
      if (p.componentKey === 'ProfileComp' && pathname.startsWith(profilePage?.pagePath ?? '')) return true;
      if (p.componentKey === 'blogPostComp' && pathname.startsWith(blogPostPage?.pagePath ?? '')) return true;
      return p.pagePath === pathname;
    });

    if (pathname !== homePage?.pagePath && pageRef) return setShell(pageRef.pageName, pageRef.pageID);

    if (pathname !== homePage?.pagePath && !pageRef && notFoundPage) {
      setShell(notFoundPage.pageName ?? '', notFoundPage.pageID ?? '');
      navigate(notFoundPage.pagePath ?? '');
    }
  }, [pages]);

  return !loadingSite ? (
    <Container TwClassName="flex-col w-screen h-screen z-30 relative bg-black">
      {activePage.activePageShellId === 'adminPage' ? <AdminNavbar /> : <Navbar />}

      <Routes>
        <Route
          path="/admin/*"
          element={
            <PageShell
              activePageShellBgColor={activePage.activePageShellName === 'Admin' ? 'bg-black' : 'bg-white'}
              activePageShellAnimation={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageShellIn,
              }}
            />
          }
        />

        {pages
          .filter((p) => p.pageActive)
          .map((p) => {
            let routePath = p.pagePath;
            if (p.componentKey === 'ProfileComp') routePath = `${p.pagePath}/:userIdFromUrl`;
            if (p.componentKey === 'blogPostComp') routePath = `${p.pagePath}/:blogPostIdFromUrl`;
            console.log(routePath)
            return (
              <Route
                key={p.pageID}
                path={routePath}
                element={
                  <PageShell
                    activePageShellBgColor={p.pageBg}
                    activePageShellAnimation={{
                      entranceAnimation: p.pageEntranceAnimation,
                      exitAnimation: p.pageExitAnimation,
                      isEntering: activePage.activePageShellIn,
                    }}
                  />
                }
              />
            );
          })}
      </Routes>

      <Modal />
      <Alert />
      <Drawer />
    </Container>
  ) : (
    <div className="w-screen h-screen z-30 relative bg-black flex justify-center items-center">
      <Loader variant="bounce" color="bg-primary" />
    </div>
  );
};

export default App;
