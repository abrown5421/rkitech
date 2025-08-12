import React from 'react';
import Container from '../../../shared/components/container/Container';
import Button from '../../../shared/components/button/Button';
import Icon from '../../../shared/components/icon/Icon';
import { useNavigationHook } from '../../../hooks/useNavigationHook';

const Sidebar: React.FC = () => {
    const clientNavigation = useNavigationHook();
     return (
         <Container 
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: true,
                },
            }} 
            TwClassName='flex-col bg-black text-white p-4 flex-2'
        >
            <Button
                onClick={() => clientNavigation('/admin/dashboard', 'AdminDash', 'adminPage')()}
                TwClassName={
                    "relative mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:text-gray-200 hover:bg-transparent flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon color="text-gray-900" name="Gauge" />
                </span>
                Dashboard
            </Button>
            <Button
                onClick={() => clientNavigation('/admin/pages', 'AdminPages', 'adminPage')()}
                TwClassName={
                    "relative mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:text-gray-200 hover:bg-transparent flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon color="text-gray-900" name="NotepadText" />
                </span>
                Pages
            </Button>
            <Button
                onClick={() => clientNavigation('/admin/menus', 'AdminMenues', 'adminPage')()}
                TwClassName={
                    "relative mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:text-gray-200 hover:bg-transparent flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon color="text-gray-900" name="Menu" />
                </span>
                Menus
            </Button>
            <Button
                onClick={() => clientNavigation('/admin/blog', 'AdminBlog', 'adminPage')()}
                TwClassName={
                    "relative mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:text-gray-200 hover:bg-transparent flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon color="text-gray-900" name="Feather" />
                </span>
                Blog
            </Button>
            <Button
                onClick={() => clientNavigation('/admin/gallery', 'AdminGallery', 'adminPage')()}
                TwClassName={
                    "relative mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:text-gray-200 hover:bg-transparent flex justify-center items-center"
                }>
                <span className="absolute left-3">
                    <Icon color="text-gray-900" name="Camera" />
                </span>
                Gallery
            </Button>
         </Container>
     );
};
export default Sidebar;
