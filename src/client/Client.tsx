import React from 'react';
import Text from '../components/text/Text';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';
import { useAppSelector } from '../store/hooks';
import Icon from '../components/Icon/Icon';

const Client: React.FC = () => {
    const activeModule = useAppSelector((state) => state.activeModule)
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn
    }
    
     return (
        
        <Container twClasses={['h-screen bg-gray-50']} animationObject={containerAnimations}>
            <Text text='Client' />
            <Icon name="Camera" />
        </Container>
     );
};
export default Client;
