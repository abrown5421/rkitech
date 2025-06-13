import React from 'react';
import Text from '../components/text/Text';
import Container from '../components/container/Container';
import type { AnimationObject } from '../components/container/containerTypes';

const Init: React.FC = () => {
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true
    }
    
     return (
        <Container twClasses={[]} animationObject={containerAnimations}>
            <Text text='Init' />
        </Container>
     );
};
export default Init;
