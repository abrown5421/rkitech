import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import { useNavigationHook } from '../../hooks/useNavigationHook';

const PageNotFound: React.FC = () => {
    const clientNavigation = useNavigationHook();

    return (
        <Container padding='sm' flexDirection='col' justifyContent='center' alignItems='center' height='h-full'>
            <Text text="404" TwClassName="text-9x text-primary font-primary font-bold" />
            <Text text="Sorry, the page you are looking for doesn't exist." TwClassName="text-2x text-black" />
            <Button
                className="mt-6"
                color="primary"
                padding="sm"
                onClick={() => clientNavigation('/', 'Home', 'homePage')()}
            >
                Go Home
            </Button>
        </Container>
    );
};

export default PageNotFound;
