
import React, { useEffect } from 'react';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import Navbar from './features/navbar/Navbar';
import PageShell from './features/pages/PageShell';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useNavigationHook } from './hooks/useNavigationHook';
import Cookies from 'js-cookie';
import { setAuthUser } from './features/auth/authUserSlice';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './shared/components/loader/Loader';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const loadingSite = useInitializeApp();
  const activePage = useAppSelector((state) => state.pageShell);
  const pages = useAppSelector((state) => state.pages.pages);

  useEffect(() => {
    const storedUser = Cookies.get('authUser');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            dispatch(setAuthUser(parsedUser));
        } catch (e) {
            console.error('Failed to parse user from cookie', e);
            Cookies.remove('authUser'); 
        }
    }
  }, [dispatch]);

  useEffect(()=>{
    const getPage = pages.find((page) => page.pagePath === location.pathname);
    if (getPage) {
      clientNavigation(location.pathname, getPage?.pageName, getPage?.pageID)()
    }
  }, [])

  return (
    
    <>  
      {!loadingSite ? (
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
      ) : (
        <div className='w-screen h-screen z-30 relative bg-black flex justify-center items-center'>
          <Loader variant='bounce' color='bg-primary' />
        </div>
      )}
    </>    
  );
};

export default App;