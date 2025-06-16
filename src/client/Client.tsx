import React from 'react';
import Text from '../components/text/Text';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';
import { useAppSelector } from '../store/hooks';
import Navbar from './features/navbar/Navbar';

const Client: React.FC = () => {
    const activeModule = useAppSelector((state) => state.activeModule)
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn
    }
    
     return (
        <Container twClasses={['h-screen', 'bg-gray-50']} animationObject={containerAnimations}>
          <Navbar twClasses={['bg-gray-50', 'pt-4 pr-2 pb-4 pl-2']} />
          <Text text='Client' />
        </Container>
     );
};
export default Client;
