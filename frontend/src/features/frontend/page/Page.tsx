import React from 'react';
import type { PageProps } from './pageTypes';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Box } from '@mui/material';
import Animation from '../animation/Animation';
import type { EntranceAnimation, ExitAnimation } from '../animation/animationTypes';
import Home from '../home/Home';
import Renderer from '../renderer/Renderer';
import { useGetElementsByIdQuery } from '../element/elementApi';
import { skipToken } from '@reduxjs/toolkit/query';
import Dashboard from '../../admin/dashboard/Dashboard';
import Sidebar from '../../admin/sidebar/Sidebar';
import Pages from '../../admin/pages/Pages';
import PageEditor from '../../admin/pageEditor/PageEditor';
import PESidebar from '../../admin/pageEditor/PESidebar';
import Media from '../../admin/media/Media';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { createElementTemplate } from '../../admin/elementBank/elementTemplates';
import { addPendingCreate } from '../renderer/rendererSlice';
import type { ElementDoc } from '../renderer/rendererTypes';

const Page: React.FC<PageProps> = ({ page }) => {
    const dispatch = useAppDispatch();
    const activePage = useAppSelector((state) => state.activePage);
    const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin');
    const { data: rootElement } = useGetElementsByIdQuery(
        page.rootElement ?? skipToken
    );
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active) {
            console.log("No valid drop target");
            return;
        }

        const componentType = String(active.id);
        
        const parentData = over.data.current as ElementDoc | undefined;

        if (!parentData || !parentData.droppable) {
            console.log("Parent is not droppable");
            return;
        }

        const newElement = createElementTemplate(componentType);

        console.log("Creating new element:", newElement);
        console.log("Adding to parent:", parentData._id);
        
        dispatch(addPendingCreate({ 
            element: newElement, 
            parentElement: parentData
        }));
    };

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', display: "flex", flexDirection: isAdminRoute ? "row" : "column" }}>
            <DndContext onDragEnd={handleDragEnd}>
                {isAdminRoute && location.pathname !== '/admin/auth' && (location.pathname.startsWith('/admin/page-editor') ? <PESidebar /> : <Sidebar />)}
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
                        {activePage.activePageUid === 'page_id_home' && <Home />}
                        {activePage.activePageUid === 'page_id_admin_dash' && <Dashboard />}
                        {activePage.activePageUid === 'page_id_admin_pages' && <Pages />}
                        {activePage.activePageUid === 'page_id_admin_page_editor' && <PageEditor />}
                        {activePage.activePageUid === 'page_id_admin_media' && <Media />}
                    </>
                ) : (
                    rootElement && <Renderer element={rootElement[0]} editMode={isAdminRoute} /> 
                )}
                </Animation>
            </DndContext>
        </Box>
    );
};
export default Page;