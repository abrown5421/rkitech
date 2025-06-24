import React, { useEffect } from 'react';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Navbar from './features/navbar/Navbar';
import { setActiveClientPage } from './features/pages/activeClientPageSlice';
import { Navigate, Route, Routes } from 'react-router';
import PageShell from './features/pages/PageShell';

const Client: React.FC = () => {
    const dispatch = useAppDispatch();
    const app = useAppSelector((state) => state.initialApp);
    const activeModule = useAppSelector((state) => state.activeModule)

    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn
    }
    
    useEffect(() => {
      const homePage = app.pages.find((page) => page.pageName === 'Home');
      if (homePage?.pageID) {
        dispatch(setActiveClientPage({ key: 'activeClientPageId', value: homePage.pageID }));
      }
      let path = location.pathname.replace('/', '');
      path = String(path).charAt(0).toUpperCase() + String(path).slice(1)
      const pageRef = app.pages.find((page) => page.pageName === path);
      const pageNotFound = app.pages.find((page) => page.pageName === "Page Not Found");
      
      if (location.pathname !== '/' && pageRef) {
        dispatch(setActiveClientPage({ key: "activeClientPageName", value: path }));
        dispatch(setActiveClientPage({ key: "activeClientPageIn", value: true }));
        dispatch(setActiveClientPage({ key: "activeClientPageId", value: pageRef.pageID }));
      } else if (location.pathname === '/page-not-found' && pageNotFound) {
        dispatch(setActiveClientPage({ key: "activeClientPageName", value: "Page Not Found" }));
        dispatch(setActiveClientPage({ key: "activeClientPageIn", value: true }));
        dispatch(setActiveClientPage({ key: "activeClientPageId", value: pageNotFound.pageID }));
      }
    }, [app]);
    
     return (
        <Container twClasses={['h-screen']} animationObject={containerAnimations}>
          <Navbar />
          <Routes>
          {app.pages.map((page) => {
            const matchedItem = app.menus
              .flatMap(menu => menu.menuItems)
              .find(item => item.itemName === page.pageName);

              return (
                <Route key={page.pageName} path={matchedItem?.itemSlug} element={<PageShell />} />
              )
            })}
            <Route path="/page-not-found" element={<PageShell />} />
            <Route path="*" element={<Navigate to="/page-not-found" />} />
          </Routes>
        </Container>
     );
};
export default Client;
