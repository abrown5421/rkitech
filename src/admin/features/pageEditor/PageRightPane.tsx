import React from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import PageRenderer from '../../../client/features/pages/PageRenderer';
import { setActiveNode } from './slices/activeEditingNodeSlice';

const PageRightPane: React.FC = () => {
    const dispatch = useAppDispatch();
    const containerAnimations = useAdminPageTransitionHook();
    const pages = useAppSelector((state) => state.initialApp.pages);
    const activePage = useAppSelector((state) => state.admin.activeEditingPage);
    const activePageObject = pages.find((page) => page.pageID === activePage.activeEditingPageId);

    const handleComponentClick = (uuid: string, type: string, props: Record<string, any>) => {
        dispatch(setActiveNode({ uuid, type, props}))
    };

     return (
         <div className='h-full'>
            <Container animationObject={containerAnimations} twClasses={['h-full', 'overflow-scroll']}>                
                {activePageObject?.pageContent && (
                    <PageRenderer node={activePageObject.pageContent} editing={true} onComponentClick={handleComponentClick} />
                )}
            </Container>
         </div>
     );
};
export default PageRightPane;
