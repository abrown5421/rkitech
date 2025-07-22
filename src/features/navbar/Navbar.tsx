import React, { type JSX } from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import Image from '../../shared/components/image/Image';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openDrawer, preCloseDrawer } from '../drawer/drawerSlice';
import Cookies from 'js-cookie';
import { clearAuthUser } from '../auth/authUserSlice';
import { getTimeOfDay } from '../../shared/utils/getTimeOfDay';
import { setLoading, setNotLoading } from '../../app/globalSlices/loading/loadingSlice';
import Loader from '../../shared/components/loader/Loader';
import Icon from '../../shared/components/icon/Icon';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const authUser = useAppSelector((state) => state.authUser);
    const pages = useAppSelector((state) => state.pages.pages);
    const menus = useAppSelector((state) => state.menus);
    const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
    const profileMenu = menus.menus.find((menu) => menu.menuName === 'Profile Menu');
    const { loading, id } = useAppSelector((state) => state.loading);
    const isLoading = loading && id === 'logoutButton';

    const renderMenuItems = (menuItems: any[]) =>
        menuItems
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
            });

    const handleDrawerOpen = (title: string, content: JSX.Element) => {
        dispatch(
            openDrawer({
                drawerOpen: true,
                drawertitle: title,
                draweranchor: 'right',
                drawerchildren: content,
                draweranimation: {
                    entranceAnimation: 'animate__fadeInRight animate__faster',
                    exitAnimation: 'animate__fadeOutRight animate__faster',
                    isEntering: true,
                },
            })
        );
    };

    const handleLogout = () => {
        dispatch(setLoading({ loading: true, id: 'logoutButton' }));
        Cookies.remove('authUser');
        dispatch(clearAuthUser());
        dispatch(setNotLoading());
        clientNavigation('/login', 'Auth', 'authenticationPage')();
    };

    const LoginButton = (
        <Button
            width="w-full"
            padding="sm"
            color="primary"
            cursor="pointer"
            onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
        >
            {isLoading ? <Loader variant="spinner" color="bg-white" /> : <Text text="Login" color="white" />}
        </Button>
    );

    const LogoutButton = (
        <Button width="w-full" padding="sm" color="primary" cursor="pointer" onClick={handleLogout}>
            {isLoading ? <Loader variant="spinner" color="bg-white" /> : <Text text="Logout" color="white" />}
        </Button>
    );

    const LoggedInDrawerContent = (
        <Container flexDirection="col" height="h-full" width="w-full" justifyContent="between">
            <Container flexDirection="col" height="h-full" width="w-full" alignItems="start">
                <Container flexDirection="col" width="w-full" alignItems="start" className='md:hidden'>
                    {renderMenuItems(primaryMenu?.menuItems || [])}
                    <hr className="w-full border-gray-300 my-2" />
                </Container>
                {renderMenuItems(profileMenu?.menuItems || [])}
            </Container>
            {LogoutButton}
        </Container>
    );

    const LoggedOutDrawerContent = (
        <Container flexDirection="col" height="h-full" width="w-full" justifyContent="between">
            <Container flexDirection="col" height="h-full" width="w-full" alignItems="start">
                {renderMenuItems(primaryMenu?.menuItems || [])}
            </Container>
            {LoginButton}
        </Container>
    );

    return (
        <Container
            height={50}
            padding="sm"
            justifyContent="between"
            alignItems="center"
            bgColor="bg-white"
            className="relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        >
            <Container
                alignItems="center"
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeInLeft',
                        exitAnimation: 'animate__fadeOutLeft',
                        isEntering: true,
                    },
                }}
            >
                <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
                <Text text="Rkitech" bold size="xl" font="primary" color="text-black" />
            </Container>

            <Container
                alignItems="center"
                className="md:hidden"
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeInRight',
                        exitAnimation: 'animate__fadeOutRight',
                        isEntering: true,
                    },
                }}
            >
                {authUser?.user ? (
                    <Button
                        padding="sm"
                        variant="ghost"
                        cursor="pointer"
                        onClick={() =>
                            handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, LoggedInDrawerContent)
                        }
                    >
                        {authUser?.user.profileImage ? (
                            <Image
                                src={authUser?.user.profileImage}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border border-gray-300 cursor-pointer"
                            />
                        ) : (
                            <Container className="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                                <Text
                                    className="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                                    text={`${authUser?.user.firstName?.[0] || ''}${authUser?.user.lastName?.[0] || ''}`.toUpperCase()}
                                />
                            </Container>
                        )}
                    </Button>
                ) : (
                    <Button
                        padding="sm"
                        color="primary"
                        variant="ghost"
                        cursor="pointer"
                        onClick={() => handleDrawerOpen(getTimeOfDay(), LoggedOutDrawerContent)}
                    >
                        <Icon name="Menu" />
                    </Button>
                )}
            </Container>

            <Container
                alignItems="center"
                className="gap-5 hidden md:flex"
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeInRight',
                        exitAnimation: 'animate__fadeOutRight',
                        isEntering: true,
                    },
                }}
            >
                {renderMenuItems(primaryMenu?.menuItems || [])}

                {authUser?.user ? (
                    <Button
                        padding="sm"
                        variant="ghost"
                        cursor="pointer"
                        onClick={() =>
                            handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, LoggedInDrawerContent)
                        }
                    >
                        {authUser?.user.profileImage ? (
                            <Image
                                src={authUser?.user.profileImage}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border border-gray-300 cursor-pointer"
                            />
                        ) : (
                            <Container className="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                                <Text
                                    className="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                                    text={`${authUser?.user.firstName?.[0] || ''}${authUser?.user.lastName?.[0] || ''}`.toUpperCase()}
                                />
                            </Container>
                        )}
                        
                    </Button>
                ) : (
                    <Button
                        padding="sm"
                        color="primary"
                        cursor="pointer"
                        onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
                    >
                        <Text text="Login" color="white" />
                    </Button>
                )}
            </Container>
        </Container>
    );
};

export default Navbar;
