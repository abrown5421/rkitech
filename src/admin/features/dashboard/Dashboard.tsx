import React from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';

const Dashboard: React.FC = () => {
    const containerAnimations = useAdminPageTransitionHook();

     return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-row bg-gray-50 flex-grow"]}>
            Dashboard visuals
         </Container>
     );
};
export default Dashboard;
