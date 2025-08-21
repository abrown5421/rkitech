import React from 'react';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const PageNotFound: React.FC = () => {
    const clientNavigation = useNavigationHook();
    const dispatch = useAppDispatch();
    const homePageId = useAppSelector((state) => state.homePageId);

    return (

        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col justify-center items-center h-full w-full'>
            <Text text="404" TwClassName="text-9xl text-amber-500 font-primary font-bold" />
            <Text text="Sorry, the page you are looking for doesn't exist." TwClassName="text-2xl text-gray-900" />
            <Button
                TwClassName="mt-6 p-2 bg-amber-500 rounded-xl text-gray-50 border-1 border-primary hover:bg-transparent hover:text-amber-500"
                onClick={() => dispatch(clientNavigation(homePageId.homePageObj?.pagePath ?? '', 'Home', homePageId.id))}
            >
                Go Home
            </Button>
        </Container>
    );
};

export default PageNotFound;
