import React from 'react';
import Text from '../components/text/Text';
import type { AnimationObject } from '../components/container/containerTypes';
import Container from '../components/container/Container';

const Client: React.FC = () => {
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true
    }
    
     return (
        <Container twClasses={[]} animationObject={containerAnimations}>
            <Text text='Admin' />
        </Container>
     );
};
export default Client;
