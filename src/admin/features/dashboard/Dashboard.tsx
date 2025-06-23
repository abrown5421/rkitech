import React from 'react';
import Cookies from 'js-cookie';
import Container from '../../../components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Drawer from '../../../components/drawer/Drawer';
import Button from '../../../components/button/Button';
import { toggleDrawer } from '../../../components/drawer/drawerSlice';
import Topbar from '../topbar/Topbar';
import { signOutUser } from '../../../services/auth/signOutUser';
import { clearAuthenticatedUser } from '../auth/authSlice';
import Menu from '../../../components/menu/Menu';
import ColorPicker from '../../components/colorPicker/ColorPicker';


const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const drawer = useAppSelector((state) => state.drawer);

    const handleLogout = async () => {
        const success = await signOutUser();
        if (success) {
            Cookies.remove('adminUserId'); 
            dispatch(toggleDrawer('adminDrawer'));
            dispatch(clearAuthenticatedUser());
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
                <Container twClasses={["flex","flex-row","items-center"]}>
                    <Menu
                        menuObject={{
                            menuName: 'Admin',
                            menuItems: [
                                { itemName: 'Dashboard', itemType: 'Page', itemSlug: '/', itemOrder: 1},
                                { itemName: 'Profile', itemType: 'Page', itemSlug: '/profile', itemOrder: 2 }
                            ]
                        }}
                        twClasses={["flex", "flex-col"]}
                        secondaryClasses={["flex", "mt-4 mr-2 mb-0 ml-2", "hover:text-amber-500", "cursor-pointer"]}
                        routingID="admin"
                    />
                </Container>
                <Container twClasses={['flex flex-row items-center']}>
                    <Button
                        label="Logout"
                        twClasses={['bg-amber-500 w-full text-white p-2']}
                        action={handleLogout}
                    />
                </Container>
            </Drawer>
            <ColorPicker
                base="bg"
                defaultColor="rose"
                defaultIntensity={400}
                defaultOpacity={80}
                onChange={(className) => console.log("New class:", className)}
            />
        </>
    );
};

export default Dashboard;
