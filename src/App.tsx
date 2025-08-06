import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './shared/components/loader/Loader';
import Container from './shared/components/container/Container';
import Cookies from 'js-cookie';
import { setPartOfActivePageShell } from './shared/features/pages/pageShellSlice';
import Navbar from './client/features/navbar/Navbar';
import PageShell from './shared/features/pages/PageShell';
import Modal from './shared/features/modal/Modal';
import Alert from './shared/features/alert/Alert';
import Drawer from './shared/features/drawer/Drawer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initializeApp = useInitializeApp();
  const activePage = useAppSelector((state) => state.pageShell);
  const adminAuthUser = useAppSelector((state) => state.adminAuthUser);
  const pages = useAppSelector((state) => state.pages.pages);
  const authUser = useAppSelector((state) => state.authUser);
  const [loadingSite, setLoadingSite] = React.useState(true);

  useEffect(() => {
    const storedClientUser = Cookies.get("authUser");
    const parsedClientUser = storedClientUser ? JSON.parse(storedClientUser) : null;

    const storedAdminUser = Cookies.get("adminAuthUser");
    const parsedAdminUser = storedAdminUser ? JSON.parse(storedAdminUser) : null;

    const unsubscribe = initializeApp(parsedClientUser, parsedAdminUser);
    setLoadingSite(false);

    return () => {
      unsubscribe?.();
    };
  }, [authUser.user?.userId, adminAuthUser.user?.userId]);

  useEffect(()=>{
    const homePage = pages.find((page) => page.pageName === 'Home');
    const pathname = location.pathname.toLowerCase();
    if (pathname.startsWith('/admin/dashboard')) {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: 'AdminDash' }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: '' }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
      return
    };

    if (pathname.startsWith('/admin')) {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: 'Admin' }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: '' }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
      return
    };

    let pageRef = pages.find((page) => {
      if (page.pageName === 'Profile' && pathname.startsWith('/profile')) {
        return true;
      }
      return page.pagePath === pathname;
    });
    const pageNotFound = pages.find((page) => page.pageName === "Page Not Found");

    if (location.pathname !== '/' && pageRef) {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: pageRef?.pageName }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: pageRef?.pageID }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
    } else if (location.pathname === '/' && homePage) {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: homePage?.pageName }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: homePage?.pageID }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
    } 

    if ((location.pathname !== '/' && !pageRef && pageNotFound) || (location.pathname === '/profile' && pageNotFound)) {
      dispatch(setPartOfActivePageShell({ key: "activePageShellName", value: pageNotFound?.pageName }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellId", value: pageNotFound?.pageID }));
      dispatch(setPartOfActivePageShell({ key: "activePageShellIn", value: true }));
      navigate(pageNotFound?.pagePath);
    }
  }, [pages])

  return (
    
    <>  
      {!loadingSite ? (
        <Container TwClassName='flex-col w-screen h-screen z-30 relative bg-black'>
          <Navbar />
          <Routes>
            <Route
              path="/admin"
              element={
                <PageShell
                  activePageShellBgColor='bg-black'
                  activePageShellAnimation={{
                    entranceAnimation: 'animate__fadeInUpBig',
                    exitAnimation: 'animate__fadeOutDownBig',
                    isEntering: activePage.activePageShellIn,
                  }}
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <PageShell
                  activePageShellBgColor='bg-white'
                  activePageShellAnimation={{
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: activePage.activePageShellIn,
                  }}
                />
              }
            />
            {pages.map((page) => {
              let routePath = page.pagePath;

              if (page.pageName === 'Profile') {
                routePath = '/profile/:userIdFromUrl';
              }

              return (
                <Route
                  key={page.pageID}
                  path={routePath}  
                  element={
                    <PageShell
                      activePageShellBgColor={page.pageBg}
                      activePageShellAnimation={{
                        entranceAnimation: page.pageEntranceAnimation,
                        exitAnimation: page.pageExitAnimation,
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
        <div className='w-screen h-screen z-30 relative bg-black flex justify-center items-center'>
          <Loader variant='bounce' color='bg-primary' />
        </div>
      )}
    </>    
  );
};

export default App;