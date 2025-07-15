import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';

const Navbar: React.FC = () => {

     return (
         <Container height={50} padding='sm' justifyContent='between' alignItems='center' className='shadow-[0_2px_4px_rgba(0,0,0,0.05)]'>
            <Text text='Rkitech' bold={true} size='xl' font='primary' />
            <Text text='menu' />
         </Container>
     );
};

export default Navbar;
