import React from 'react';
import Container from '../../../shared/components/container/Container';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getTimeOfDay } from '../../../shared/utils/getTimeOfDay';
import { openDrawer } from '../../../shared/features/drawer/drawerSlice';
import type { DrawerContentType } from '../../../shared/features/drawer/drawerTypes';

const AdminNavbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const authAdminUser = useAppSelector((state) => state.adminAuthUser)

    const handleDrawerOpen = (title: string, contentType: DrawerContentType) => {
        dispatch(
            openDrawer({
            title,
            contentType,
            anchor: 'right',
            animation: {
                entranceAnimation: 'animate__fadeInRight animate__faster',
                exitAnimation: 'animate__fadeOutRight animate__faster',
                isEntering: true,
            },
            })
        );
    };
     return (
        <Container
            TwClassName="h-[50px] justify-between items-center bg-white p-2 relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        >
        <Container
            TwClassName="items-center"
            animation={{
            entranceExit: {
                entranceAnimation: 'animate__fadeInLeft',
                exitAnimation: 'animate__fadeOutLeft',
                isEntering: true,
            },
            }}
        >
            <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
            <Text text="Rkitech" TwClassName="text-xl font-primary text-black" />
        </Container>

        <Container
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeInRight',
                    exitAnimation: 'animate__fadeOutRight',
                    isEntering: true,
                },
            }}
        >
            {authAdminUser?.user && (
                <Button
                    TwClassName="p-2"
                    cursor="pointer"
                    onClick={() => handleDrawerOpen(`${getTimeOfDay()}, ${authAdminUser.user?.firstName}`, 'loggedInAdminMenu')} //err here
                >
                    <div className="relative inline-block">
                        {authAdminUser?.user.profileImage ? (
                            <Image
                                src={authAdminUser.user.profileImage}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                TwClassName="rounded-full border border-gray-300 cursor-pointer object-cover"
                            />
                        ) : (
                            <Container TwClassName="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                            <Text
                                TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                                text={`${authAdminUser.user.firstName?.[0] || ''}${authAdminUser.user.lastName?.[0] || ''}`.toUpperCase()}
                            />
                            </Container>
                        )}                    
                    </div>
                </Button>
                )}
        </Container>
        </Container>
     );
};
export default AdminNavbar;
