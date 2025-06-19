import React from 'react';
import Container from '../../../components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Drawer from '../../../components/drawer/Drawer';
import Button from '../../../components/button/Button';
import { toggleDrawer } from '../../../components/drawer/drawerSlice';
import Topbar from '../topbar/Topbar';
import { signOutUser } from '../../../services/auth/signOutUser';
import { clearAuthenticatedUser } from '../auth/authSlice';


const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const drawer = useAppSelector((state) => state.drawer);

    const handleLogout = async () => {
        const success = await signOutUser();
        if (success) {
            dispatch(toggleDrawer('adminDrawer'));
            dispatch(clearAuthenticatedUser())
        } else {
            console.error('Failed to sign out.');
        }
    };

    return (
        <>
            <Topbar />
            <Drawer
                open={!!drawer['adminDrawer']}
                orientation="right"
                width="400px"
                onClose={() => dispatch(toggleDrawer('adminDrawer'))}
                twClasses={['flex flex-col justify-between']}
            >
                <Container twClasses={['flex flex-row items-center']}>
                    links
                </Container>
                <Container twClasses={['flex flex-row items-center']}>
                    <Button
                        label="Logout"
                        twClasses={['bg-amber-500 w-full text-white p-2']}
                        action={handleLogout}
                    />
                </Container>
            </Drawer>
        </>
    );
};

export default Dashboard;
