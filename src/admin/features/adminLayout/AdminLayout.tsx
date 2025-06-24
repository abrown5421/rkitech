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
import { Route, Routes } from 'react-router';
import DashboardMenu from '../dashboard/DashboardMenu';
import Dashboard from '../dashboard/Dashboard';
import Profile from '../profile/Profile';
import ProfileMenu from '../profile/ProfileMenu';
import PagesMenu from '../pages/PagesMenu';
import PagesEditor from '../pages/PagesEditor';


const AdminLayout: React.FC = () => {
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
        <Container twClasses={["flex", "flex-col", "h-screen"]}>
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
                        requirePageMatch={false}
                        menuObject={{
                            menuName: 'Admin',
                            menuItems: [
                                { itemName: 'Dashboard', itemType: 'Page', itemSlug: '/', itemOrder: 1},
                                { itemName: 'Profile', itemType: 'Page', itemSlug: 'profile', itemOrder: 2 }
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
            <Container twClasses={['flex flex-row body-no-nav']}>
                <Container twClasses={['flex flex-col flex-1/4 flex-grow bg-gray-50 p-4']}>
                    <Routes>
                        <Route path="/" element={<DashboardMenu />} />
                        <Route path="/profile" element={<ProfileMenu />} />
                        <Route path="/pages" element={<PagesMenu />} />
                    </Routes>
                </Container>    
                <Container twClasses={['flex flex-col flex-3/4 flex-grow p-4']}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/pages" element={<PagesEditor />} />
                    </Routes>
                </Container>    
            </Container>
        </Container>
    );
};

export default AdminLayout;
