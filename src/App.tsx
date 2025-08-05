import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './shared/components/loader/Loader';
import Container from './shared/components/container/Container';
import Cookies from 'js-cookie';
import { setPartOfActivePageShell } from './client/features/pages/pageShellSlice';
import Navbar from './client/features/navbar/Navbar';
import PageShell from './client/features/pages/PageShell';
import Modal from './shared/features/modal/Modal';
import Alert from './shared/features/alert/Alert';
import Drawer from './shared/features/drawer/Drawer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initializeApp = useInitializeApp();
  const activePage = useAppSelector((state) => state.pageShell);
  const pages = useAppSelector((state) => state.pages.pages);
  const notif = useAppSelector((state) => state.notifications);
  const authUser = useAppSelector((state) => state.authUser);
  const [loadingSite, setLoadingSite] = React.useState(true);

  useEffect(()=>{console.log(notif)}, [notif])

  useEffect(() => {
    const storedUser = Cookies.get("authUser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const unsubscribe = initializeApp(parsedUser);
    setLoadingSite(false);

    return () => {
      unsubscribe?.(); 
    };
  }, [authUser.user?.userId]);

  useEffect(()=>{
    const homePage = pages.find((page) => page.pageName === 'Home');
    const pathname = location.pathname.toLowerCase();
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