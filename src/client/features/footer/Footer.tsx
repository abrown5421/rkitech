import React from 'react';
import Container from '../../../shared/components/container/Container';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { preCloseModal } from '../../../shared/features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import { preCloseDrawer } from '../../../shared/features/drawer/drawerSlice';

const Footer: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const pages = useAppSelector((state) => state.pages.pages);
    const activePage = useAppSelector((state) => state.pageShell.activePageShellName)
    const menus = useAppSelector((state) => state.menus);
    const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
    const auxilaryMenu = menus.menus.find((menu) => menu.menuName === 'Auxilary Menu');

    const currentYear = new Date().getFullYear();

    return (
        <Container
            TwClassName='flex-col justify-between items-start bg-white relative pt-4 pr-2 pb-4 pl-2 z-40 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]'
        >
            <Container
                TwClassName="items-center block md:hidden"
            >
                <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
                <Text text="Rkitech" TwClassName="text-xl font-primary text-black" />
            </Container>
            <Container TwClassName='w-full items-start flex-col md:flex-row gap-0 md:gap-5'>
                {primaryMenu?.menuItems
                    ?.slice()
                    .sort((a, b) => a.itemOrder - b.itemOrder)
                    .map((menuItem) => {
                        if (menuItem.itemType === 'page') {
                            const page = pages.find((p) => p.pageID === menuItem.itemId);
                            if (!page || !page.pageActive) return null;
                            return (
                                <Button
                                    key={menuItem.itemId}
                                    TwClassName={`p-2 md:pt-3 md:pr-0 md:pb-3 md:pl-0 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary`}                                    
                                    onClick={() => {
                                        dispatch(preCloseModal());
                                        setTimeout(() => clientNavigation(page.pagePath, page.pageName, page.pageID)(), 250);
                                    }}
                                >
                                    {page.pageName}
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    key={menuItem.itemName}
                                    TwClassName={`p-2 md:pt-3 md:pr-0 md:pb-3 md:pl-0 text-black hover:text-primary`}
                                    cursor="pointer"
                                    onClick={() => window.open(menuItem.itemLink, '_blank')}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        }
                })}
                
            </Container>
            <Container TwClassName='w-full items-center flex-col md:flex-row gap-0 md:gap-2'>
                <Text
                    text={`© ${currentYear} Rkitech. All rights reserved.`}
                    TwClassName="mt-1 text-sm text-gray-500"
                />
                {auxilaryMenu?.menuItems
                    ?.slice()
                    .sort((a, b) => a.itemOrder - b.itemOrder)
                    .map((menuItem) => {
                        if (menuItem.itemType === 'page') {
                            const page = pages.find((p) => p.pageID === menuItem.itemId);
                            if (!page || !page.pageActive) return null;
                            return (
                                <Button
                                    key={menuItem.itemId}
                                    TwClassName={`p-2 md:pt-4 md:pr-0 md:pb-3 md:pl-0 text-sm text-gray-500 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary`}                                    
                                    onClick={() => {
                                        dispatch(preCloseDrawer());
                                        setTimeout(() => clientNavigation(page.pagePath, page.pageName, page.pageID)(), 250);
                                    }}
                                >
                                    <span className="text-gray-400 pt-0 pr-3 pb-0 pl-0 hidden md:block">|</span>
                                   {menuItem.itemName}
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    key={menuItem.itemName}
                                    TwClassName={`pt-4 pr-0 pb-3 pl-0 text-sm text-gray-500 text-black hover:text-primary`}
                                    cursor="pointer"
                                    onClick={() => window.open(menuItem.itemLink, '_blank')}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        }
                })}
            </Container>
        </Container>
    );
};

export default Footer;
