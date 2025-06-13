import React from 'react';
import Text from '../components/text/Text';
import Container from '../components/container/Container';
import type { AnimationObject } from '../components/container/containerTypes';
import { useAppSelector } from '../store/hooks';

const Init: React.FC = () => {
    const activeModule = useAppSelector((state) => state.activeModule)
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn
    }
    
     return (
        <Container twClasses={['h-screen bg-gray-50']} animationObject={containerAnimations}>
            <Text text='Init' />
        </Container>
     );
};
export default Init;
