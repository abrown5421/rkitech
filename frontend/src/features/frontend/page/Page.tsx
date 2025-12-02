import React from 'react';
import type { PageProps } from './pageTypes';
import { useAppSelector } from '../../../store/hooks';
import { Box } from '@mui/material';
import Animation from '../animation/Animation';
import type { EntranceAnimation, ExitAnimation } from '../animation/animationTypes';
import Home from '../home/Home';
import Renderer from '../renderer/Renderer';
import { useGetElementsByIdQuery } from '../element/elementApi';

const Page: React.FC<PageProps> = ({ page }) => {
    const activePage = useAppSelector((state) => state.activePage);
    const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
    const { data: rootElement} = useGetElementsByIdQuery(page.rootElement ?? "")

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative', overflow: 'scroll', display: "flex", flexDirection: isAdminRoute ? "row" : "column" }}>
            <Animation
                animationObject={{
                    entranceAnimation: page.pageEntranceAnimation as EntranceAnimation,
                    exitAnimation: page.pageExitAnimation as ExitAnimation,
                    isEntering: activePage.activePageAnimateIn,
                }}
                position='relative'
                display='flex'
                flexDirection='column'
                flex={10}
                zIndex={1}
                width='100%'
                bgcolor={page.pageColor}
                boxSizing='border-box'
            >
                {page.pageRenderMethod === 'static' ? (
                    <>
                        {activePage.activePageName === 'Home' && <Home />}
                    </>
                ) : (
                    rootElement && <Renderer element={rootElement} />
                )}
            </Animation>
        </Box>
    );
};
export default Page;
