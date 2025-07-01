import React, { useEffect } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppSelector } from '../../../store/hooks';
import PageRenderer from '../../../client/features/pages/PageRenderer';

const PageRightPane: React.FC = () => {
    const containerAnimations = useAdminPageTransitionHook();
    const pages = useAppSelector((state) => state.initialApp.pages);
    const activePage = useAppSelector((state) => state.admin.activeEditingPage);
    const activePageObject = pages.find((page) => page.pageID === activePage.activeEditingPageId);

    useEffect(()=>{console.log(activePage)}, [activePage])

     return (
         <Container animationObject={containerAnimations} twClasses={['h-full', 'overflow-scroll']}>
            {activePageObject?.pageContent && (
                <PageRenderer node={activePageObject.pageContent} />
            )}
         </Container>
     );
};
export default PageRightPane;
