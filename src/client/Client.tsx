import React, { useEffect } from 'react';
import Text from '../components/text/Text';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Navbar from './features/navbar/Navbar';
import { setActiveClientPage } from './features/pages/activeClientPageSlice';

const Client: React.FC = () => {
    const dispatch = useAppDispatch();
    const app = useAppSelector((state) => state.initialApp);
    const activeModule = useAppSelector((state) => state.activeModule)
    
    const navbarConfig = app.components.find((component) => component.componentName === 'Navbar');

    const navbarClasses = navbarConfig?.componentClasses?.map(
      (item) => item.classDefinition
    ) ?? [];

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
    }, [app]);

     return (
        <Container twClasses={['h-screen bg-gray-50']} animationObject={containerAnimations}>
          <Navbar twClasses={navbarClasses} />
          <Text text='Client' />
        </Container>
     );
};
export default Client;
