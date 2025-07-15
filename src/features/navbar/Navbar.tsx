import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import Image from '../../shared/components/image/Image';

const Navbar: React.FC = () => {

     return (
         <Container height={50} padding='sm' justifyContent='between' alignItems='center' className='shadow-[0_2px_4px_rgba(0,0,0,0.05)]'>
            <Container alignItems='center'>
                <Image src="../../../public/assets/images/logo.png" height={50} alt='Rkitech' />
                <Text text='Rkitech' bold={true} size='xl' font='primary' />
            </Container>
            <Button padding='sm' color='primary' cursor='pointer'>
                <Text text='Login' color='white' />
            </Button>
         </Container>
     );
};

export default Navbar;
