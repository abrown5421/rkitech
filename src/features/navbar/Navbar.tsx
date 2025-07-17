import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import Image from '../../shared/components/image/Image';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppSelector } from '../../app/hooks';

const Navbar: React.FC = () => {
    const clientNavigation = useNavigationHook();
    const authUser = useAppSelector((state) => state.authUser);

     return (
         <Container height={50} padding='sm' justifyContent='between' alignItems='center' bgColor='bg-white' className='relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.05)]'>
            <Container 
                alignItems='center' 
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeInLeft',
                        exitAnimation: 'animate__fadeOutLeft',
                        isEntering: true,
                    },
                }}
            >
                <Image src="../../../public/assets/images/logo.png" height={50} alt='Rkitech' />
                <Text text='Rkitech' bold={true} size='xl' font='primary' color='text-black' />
            </Container>
            <Container 
                alignItems='center' 
                className='gap-5'
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeInRight',
                        exitAnimation: 'animate__fadeOutRight',
                        isEntering: true,
                    },
                }}
            >
                <Button 
                    padding='sm' 
                    variant='ghost'
                    cursor='pointer'
                    onClick={() =>
                        clientNavigation('/', 'Home', 'homePage')()
                    }
                > 
                    <Text text='Home' color='text-black' />
                </Button>
                <Button 
                    padding='sm' 
                    variant='ghost'
                    cursor='pointer'
                    onClick={() =>
                        clientNavigation('/test-page', 'Test', 'testPage')()
                    }
                > 
                    <Text text='Test Page' color='text-black' />
                </Button>
                {authUser?.user ? (
                    <Image
                        src="../../../public/assets/images/placeholder-avatar.png" 
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full border border-gray-300 cursor-pointer"
                    />
                ) : (
                    <Button
                        padding="sm"
                        color="primary"
                        cursor="pointer"
                        onClick={() =>
                            clientNavigation('/login', 'Auth', 'authenticationPage')()
                        }
                    >
                        <Text text="Login" color="white" />
                    </Button>
                )}
            </Container>
         </Container>
     );
};

export default Navbar;
