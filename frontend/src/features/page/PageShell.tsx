import React from 'react';
import { Container } from 'rkitech-components';
import type { IPage } from './pageTypes';

const PageShell: React.FC<IPage> = () => {

    return (
        <Container
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: true,
            }}
            tailwindClasses='flex-col bg-gray-50'
        >
            PageShell
        </Container>
    );
};
export default PageShell;
