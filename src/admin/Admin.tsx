import React from 'react';
import Container from '../components/container/Container';
import type { AnimationObject } from '../components/container/containerTypes';
import { useAppSelector } from '../store/hooks'; 
import { Route, Routes } from 'react-router';
import Dashboard from './features/dashboard/Dashboard';

const Admin: React.FC = () => {
    const activeModule = useAppSelector((state) => state.activeModule)
    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn
    }
    
     return (
        <Container twClasses={['h-screen bg-gray-50']} animationObject={containerAnimations}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Container>
     );
};
export default Admin;
