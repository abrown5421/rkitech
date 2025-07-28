import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../shared/components/button/Button';
import { preCloseDrawer } from '../drawer/drawerSlice';
import { useNavigationHook } from '../../hooks/useNavigationHook';

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
            <Container TwClassName='flex-row gap-5'>
                {primaryMenu?.menuItems
                    ?.slice()
                    .sort((a, b) => a.itemOrder - b.itemOrder)
                    .map((menuItem) => {
                        if (menuItem.itemType === 'page') {
                            const page = pages.find((p) => p.pageID === menuItem.itemId);
                            if (!page) return null;
                            return (
                                <Button
                                    key={menuItem.itemId}
                                    TwClassName={`pt-3 pr-0 pb-3 pl-0 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary`}                                    
                                    onClick={() => {
                                        dispatch(preCloseDrawer());
                                        setTimeout(() => clientNavigation(page.pagePath, page.pageName, page.pageID)(), 250);
                                    }}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    key={menuItem.itemName}
                                    TwClassName={`pt-3 pr-0 pb-3 pl-0 text-black hover:text-primary`}
                                    cursor="pointer"
                                    onClick={() => window.open(menuItem.itemLink, '_blank')}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        }
                })}
            </Container>

            <Text
                text={`© ${currentYear} Rkitech. All rights reserved.`}
                TwClassName="mt-4 text-sm text-gray-500"
            />
            {primaryMenu?.menuItems
                    ?.slice()
                    .sort((a, b) => a.itemOrder - b.itemOrder)
                    .map((menuItem) => {
                        if (menuItem.itemType === 'page') {
                            const page = pages.find((p) => p.pageID === menuItem.itemId);
                            if (!page) return null;
                            return (
                                <Button
                                    key={menuItem.itemId}
                                    TwClassName={`pt-3 pr-0 pb-3 pl-0 mt-4 text-sm text-gray-500 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary`}                                    
                                    onClick={() => {
                                        dispatch(preCloseDrawer());
                                        setTimeout(() => clientNavigation(page.pagePath, page.pageName, page.pageID)(), 250);
                                    }}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    key={menuItem.itemName}
                                    TwClassName={`pt-3 pr-0 pb-3 pl-0 mt-4 text-sm text-gray-500 text-black hover:text-primary`}
                                    cursor="pointer"
                                    onClick={() => window.open(menuItem.itemLink, '_blank')}
                                >
                                    {menuItem.itemName}
                                </Button>
                            );
                        }
                    }}
        </Container>
    );
};

export default Footer;
