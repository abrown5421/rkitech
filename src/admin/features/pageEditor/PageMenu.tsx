import React from 'react';
import Container from '../../../components/container/Container';
import type { AnimationObject } from '../../../components/container/containerTypes';
import { useAppSelector } from '../../../store/hooks';

const PageMenu: React.FC = () => {
    const activeAdminPage = useAppSelector((state) => state.admin.activeAdminPage);
    
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeAdminPage.activeAdminPageIn,
    };

     return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-row bg-gray-50 flex-grow"]}>
            PageMenu visuals
         </Container>
     );
};
export default PageMenu;
