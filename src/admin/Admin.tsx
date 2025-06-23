import React, { useEffect } from 'react';
import Container from '../components/container/Container';
import type { AnimationObject } from '../components/container/containerTypes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Route, Routes } from 'react-router';
import Auth from './features/auth/Auth'; 
import { useCookieToAuth } from '../hooks/useCookieToAuth';
import { setAuthenticatedUser } from './features/auth/authSlice';
import AdminLayout from './features/adminLayout/AdminLayout';

const Admin: React.FC = () => {
    const dispatch = useAppDispatch()
    const activeModule = useAppSelector((state) => state.activeModule);
    const activeAdminPage = useAppSelector((state) => state.admin.activeAdminPage);
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

    useEffect(()=>{console.log(activeAdminPage)}, [activeAdminPage])

    return (
        <Container twClasses={['h-screen bg-gray-900']} animationObject={containerAnimations}>
            <Routes>
                <Route path="*" element={auth.authenticatedUser ? <AdminLayout /> : <Auth />} />
            </Routes>
        </Container>
    );
};

export default Admin;
