import React from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageShellTypes';

const PageShell: React.FC<PageShellState> = ({activePageShellBgColor = 'bg-white'}) => {
    return (
        <Container padding='md' className={`${activePageShellBgColor} relative z-20 h-[calc(100vh-50px)]`}>
            page
        </Container>
    );
};

export default PageShell;
