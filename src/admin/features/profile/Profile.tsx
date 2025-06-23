import React from 'react';
import Container from '../../../components/container/Container';
import { useAppSelector } from '../../../store/hooks';
import type { AnimationObject } from '../../../components/container/containerTypes';

const Profile: React.FC = () => {
    const activeAdminPage = useAppSelector((state) => state.admin.activeAdminPage);

    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeAdminPage.activeAdminPageIn,
    };

     return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-row bg-gray-50 flex-grow"]}>
            Profile visuals
         </Container>
     );
};
export default Profile;
