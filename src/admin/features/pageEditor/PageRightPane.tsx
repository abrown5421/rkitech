import React from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppSelector } from '../../../store/hooks';

const PageRightPane: React.FC = () => {
    const containerAnimations = useAdminPageTransitionHook();
    const pages = useAppSelector((state) => state.initialApp.pages);

     return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-row bg-gray-50 flex-grow"]}>
            PageEditor visuals
         </Container>
     );
};
export default PageRightPane;
