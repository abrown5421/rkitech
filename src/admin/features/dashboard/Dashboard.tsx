import React from 'react';
import Container from '../../../components/container/Container';
import Image from '../../../components/image/Image';
import Icon from '../../../components/Icon/Icon';
import Text from '../../../components/text/Text';
import { getTimeOfDay } from '../../../utils/getTimeOfDay';
import { useAppSelector } from '../../../store/hooks';

const Dashboard: React.FC = () => {
    const app = useAppSelector((state) => state.initialApp)
    const imageObj = app.images.find((images) => images.imageGroupName === 'Logo')
    const logo = imageObj?.images.find((img) => img.imageName === 'Logo')

     return (
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
                    <Text text={getTimeOfDay()} twClasses={['text-amber-500 font-mono font-bold text-xl']} />
                </Container>
                <Container twClasses={['flex flex-row items-center']}>
                    <Icon name="Home" />
                </Container>
            </Container>
         </Container>
     );
};
export default Dashboard;
