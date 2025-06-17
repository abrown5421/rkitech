import React, { useState, useEffect } from 'react';
import './page-shell.css';
import { useAppSelector } from '../../../store/hooks';
import Container from '../../../components/container/Container';
import type { AnimationObject } from '../../../components/container/containerTypes';
import PageRenderer from './PageRenderer';

const PageShell: React.FC = () => {
    const activePage = useAppSelector((state) => state.client.activeClientPage);
    const pages = useAppSelector((state) => state.initialApp.pages);
    const activePageObject = pages.find((page) => page.pageID === activePage.activeClientPageId);

    const [containerAnimations, setContainerAnimations] = useState<AnimationObject>({
        entranceAnimation: '',
        exitAnimation: '',
        isEntering: false
    });

    useEffect(() => {
        setContainerAnimations({
            entranceAnimation: activePageObject?.animationConfig?.entranceAnimation || '',
            exitAnimation: activePageObject?.animationConfig?.exitAnimation || '',
            isEntering: activePage.activeClientPageIn
        });
    }, [activePageObject, activePage.activeClientPageIn]);
    
     return (
         <div className="page-shell">
            <Container twClasses={['h-full', 'overflow-scroll']} animationObject={containerAnimations}>
                <div className='h-full'>
                    {activePageObject?.pageContent && (
                        <PageRenderer node={activePageObject.pageContent} />
                    )}
                </div>
            </Container>
         </div>
     );
};
export default PageShell;
