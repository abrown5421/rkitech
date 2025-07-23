import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import { useNavigationHook } from '../../hooks/useNavigationHook';

const PageNotFound: React.FC = () => {
    const clientNavigation = useNavigationHook();

    return (
        <Container padding='sm' flexDirection='col' justifyContent='center' alignItems='center'>
            <Text text="404 - Page Not Found" size="9x" color="text-primary" />
            <Text text="Sorry, the page you are looking for doesn't exist." size="lg" color="text-black" />
            <Button
                className="mt-6"
                color="primary"
                padding="md"
                onClick={() => clientNavigation('/', 'Home', 'homePage')()}
            >
                Go Home
            </Button>
        </Container>
    );
};

export default PageNotFound;
