import React, { useEffect } from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageShellTypes';

const PageShell: React.FC<PageShellState> = ({
    pageShellRenderMethod = 'dynamic',
    pageShellBackgroundColor = 'bg-white',
    pageShellAnimation = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true,
    }
}) => {

    useEffect(()=>{console.log(pageShellRenderMethod)}, [])

    return (
        <Container 
            padding='md' 
            className={`${pageShellBackgroundColor} z-20 h-[calc(100vh-50px)]`}
            animation={{
                entranceExit: {
                    entranceAnimation: pageShellAnimation.entranceAnimation,
                    exitAnimation: pageShellAnimation.exitAnimation,
                    isEntering: pageShellAnimation.isEntering,
                },
            }}
        >
            page
        </Container>
    );
};

export default PageShell;
