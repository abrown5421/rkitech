import React from 'react';
import Container from '../../shared/components/container/Container';
import type { PageShellState } from './pageShellTypes';
import { useAppSelector } from '../../app/hooks';
import Auth from '../auth/Auth';

const PageShell: React.FC<PageShellState> = ({activePageShellBgColor = 'bg-white'}) => {
    const activePage = useAppSelector((state) => state.pageShell);

    return (
        <Container padding='md' className={`${activePageShellBgColor} relative z-20 h-[calc(100vh-50px)]`}>
            {activePage.activePageShellName === 'Auth' && <Auth />}
        </Container>
    );
};

export default PageShell;
 