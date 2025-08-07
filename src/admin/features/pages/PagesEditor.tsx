import React from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppSelector } from '../../../app/hooks';

const PagesEditor: React.FC = () => {
    const pages = useAppSelector((state) => state.pages.pages);   

    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col'>
            {pages.map((page) => (
                <Container TwClassName='flex-row'>
                    {page.pageName}
                </Container>
            ))}
        </Container>
    );
};
export default PagesEditor;
