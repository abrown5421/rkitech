import React from 'react';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';

const PageNotFound: React.FC = () => {
    const clientNavigation = useNavigationHook();

    return (

        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col justify-center items-center h-full w-full'>
            <Text text="404" TwClassName="text-9xl text-primary font-primary font-bold" />
            <Text text="Sorry, the page you are looking for doesn't exist." TwClassName="text-2xl text-black" />
            <Button
                TwClassName="mt-6 p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary"
                onClick={() => clientNavigation('/', 'Home', 'homePage')()}
            >
                Go Home
            </Button>
        </Container>
    );
};

export default PageNotFound;
