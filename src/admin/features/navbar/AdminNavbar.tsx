import React from 'react';
import Container from '../../../shared/components/container/Container';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';

const Component: React.FC = () => {

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
            TwClassName="items-center md:hidden"
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeInRight',
                    exitAnimation: 'animate__fadeOutRight',
                    isEntering: true,
                },
            }}
        >
            menu
        </Container>
        </Container>
     );
};
export default Component;
