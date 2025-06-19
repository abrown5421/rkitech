import React, { useEffect } from 'react';
import Container from '../components/container/Container';
import type { AnimationObject } from '../components/container/containerTypes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Route, Routes } from 'react-router';
import Dashboard from './features/dashboard/Dashboard';
import Auth from './features/auth/Auth'; 
import { useCookieToAuth } from '../hooks/useCookieToAuth';
import { setAuthenticatedUser } from './features/auth/authSlice';

const Admin: React.FC = () => {
    const dispatch = useAppDispatch()
    const activeModule = useAppSelector((state) => state.activeModule);
    const auth = useAppSelector((state) => state.admin.adminAuth);

    const containerAnimations: AnimationObject = {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: activeModule.activeModuleIn,
    };

    useEffect(() => {
        (async () => {
        const result = await useCookieToAuth();
        if (result) {
            dispatch(setAuthenticatedUser(result));
        }
        })();
    }, []);

    return (
        <Container twClasses={['h-screen bg-gray-900']} animationObject={containerAnimations}>
            <Routes>
                <Route path="/" element={auth.authenticatedUser ? <Dashboard /> : <Auth />} />
            </Routes>
        </Container>
    );
};

export default Admin;
