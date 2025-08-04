import React, { useEffect } from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pages/PageShell';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './shared/components/loader/Loader';
import Container from './shared/components/container/Container';
import { setPartOfActivePageShell } from './features/pages/pageShellSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loadingSite = useInitializeApp();
  const activePage = useAppSelector((state) => state.pageShell);
  const pages = useAppSelector((state) => state.pages.pages);
  const notif = useAppSelector((state) => state.notifications);

  useEffect(()=>{console.log(notif)}, [notif])

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