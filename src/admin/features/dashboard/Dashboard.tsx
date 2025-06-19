import React, { useState } from 'react';
import Container from '../../../components/container/Container';
import Image from '../../../components/image/Image';
import Text from '../../../components/text/Text';
import { getTimeOfDay } from '../../../utils/getTimeOfDay';
import { useAppSelector } from '../../../store/hooks';
import Drawer from '../../../components/drawer/Drawer';
import Button from '../../../components/button/Button';
import Avatar from '../../../components/avatar/Avatar';


const Dashboard: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const app = useAppSelector((state) => state.initialApp);
    const user = useAppSelector((state) => state.admin.adminAuth);
    const imageObj = app.images.find((images) => images.imageGroupName === 'Logo');
    const logo = imageObj?.images.find((img) => img.imageName === 'Logo');

    return (
        <>
            <Container twClasses={['h-full']}>
                <Container twClasses={['flex flex-row justify-between items-center relative z-50 shadow-md bg-gray-50 pt-0 pr-2 pb-0 pl-2']}>
                    <Container twClasses={['flex flex-row items-center']}>
                        {logo && (
                            <Image 
                                alt="Logo"
                                height={50}
                                src={logo.imageURL}
                            />
                        )}
                        <Text
                            text={getTimeOfDay() + ', ' + user.authenticatedUser?.userFirstName}
                            twClasses={['text-amber-500 font-mono font-bold text-xl']}
                        />
                    </Container>
                    <Container twClasses={['flex flex-row items-center']}>
                        <Button
                            label={
                                <Avatar
                                    avatarImage={user.authenticatedUser?.userImage ?? ''}
                                    avatarFirstName={user.authenticatedUser?.userFirstName ?? ''}
                                    avatarLastName={user.authenticatedUser?.userLastName ?? ''}
                                />
                            }
                            twClasses={[]}
                            action={() => setDrawerOpen(true)}
                        />
                    </Container>
                </Container>
            </Container>

            <Drawer
                open={drawerOpen}
                orientation="right"
                width="400px"
                onClose={() => setDrawerOpen(false)}
            >
                example nav here
            </Drawer>
        </>
    );
};

export default Dashboard;
