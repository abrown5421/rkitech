import React from 'react';
import Container from '../../shared/components/container/Container';

const Auth: React.FC = () => {

    return (
        <Container width='w-full' height='h-full' justifyContent='center' alignItems='center'>
            <Container width='w-11/12 md:w-1/3' height='h-1/2' padding='md' className='bg-white rounded-xl'>
                auth page
            </Container>
        </Container>
    );
};

export default Auth;
