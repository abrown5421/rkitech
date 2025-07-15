import React, { useEffect } from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pageShell/PageShell';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { useNavigationHook } from './hooks/useNavigationHook';

const App: React.FC = () => {
  const clientNavigation = useNavigationHook();
  const activePage = useAppSelector((state) => state.pageShell);

  const pages = [
    {pageName: 'Home', pageId:'homePage', pagePath: '/', pageBg: 'bg-white', pageEntranceAnimation: 'animate__fadeIn', pageExitAnimation: 'animate__fadeOut'},
    {pageName: 'Auth', pageId:'authenticationPage', pagePath: '/login', pageBg: 'bg-transparent', pageEntranceAnimation: 'animate__fadeInUpBig', pageExitAnimation: 'animate__fadeOutDownBig'},
  ];

  useEffect(()=>{
    const getPage = pages.find((page) => page.pagePath === location.pathname);
    if (getPage) {
      clientNavigation(location.pathname, getPage?.pageName, getPage?.pageId)()
    }
  }, [])

  return (
    <div className='w-screen h-screen z-30 relative bg-black'>
      <Navbar />
      <Routes>
        {pages.map((page) => { 
          return (
            <Route path={page.pagePath} element={
                <PageShell 
                  activePageShellBgColor={page.pageBg} 
                  activePageShellAnimation = {{
                    entranceAnimation: page.pageEntranceAnimation,
                    exitAnimation: page.pageExitAnimation,
                    isEntering: activePage.activePageShellIn,
                  }}
                />
              } 
            />
          )
        })}
      </Routes>
      <Modal />
      <Alert />
      <Drawer />
    </div>
    
  );
};

export default App;
