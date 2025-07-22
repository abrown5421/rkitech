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
    const menus = useAppSelector((state) => state.menus);
    const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');

    const currentYear = new Date().getFullYear();

    return (
        <Container
            flexDirection='col'
            justifyContent="between"
            alignItems="start"
            bgColor="bg-white"
            className="relative pt-4 pr-2 pb-4 pl-2 z-40 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]"
        >
            <Container flexDirection='row' className='gap-5'>
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
                                    className="pt-3 pr-0 pb-3 pl-0"
                                    variant="ghost"
                                    cursor="pointer"
                                    onClick={() => {
                                        dispatch(preCloseDrawer());
                                        setTimeout(() => clientNavigation(page.pagePath, page.pageName, page.pageID)(), 250);
                                    }}
                                >
                                    <Text text={menuItem.itemName} color="text-black" />
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    key={menuItem.itemName}
                                    className="pt-3 pr-0 pb-3 pl-0"
                                    variant="ghost"
                                    cursor="pointer"
                                    onClick={() => window.open(menuItem.itemLink, '_blank')}
                                >
                                    <Text text={menuItem.itemName} color="text-black" />
                                </Button>
                            );
                        }
                })}
            </Container>

            <Text
                text={`© ${currentYear} Rkitech. All rights reserved.`}
                size="sm"
                color="text-gray-500"
                className="mt-4"
            />
        </Container>
    );
};

export default Footer;
