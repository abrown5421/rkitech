
import React from 'react';
import { Container, type EntranceAnimation, type ExitAnimation } from 'rkitech-components';
import type { PageShellProps } from './pageTypes';

const PageShell: React.FC<PageShellProps> = ({ page }) => {

    return (
        <Container
            animationObject={{
                entranceAnimation: page.pageEntranceAnimation ? page.pageEntranceAnimation as EntranceAnimation : 'animate__fadeIn',
                exitAnimation: page.pageExitAnimation ? page.pageExitAnimation as ExitAnimation : 'animate__fadeOut',
                isEntering: true,
            }}
            tailwindClasses={`flex-col bg-gray-50 w-full`}
        >
            {page.pageName}
        </Container>
    );
};
export default PageShell;
