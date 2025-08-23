import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';
import Container from '../../../shared/components/container/Container';
import PageEditorEnvironmentButtons from './PageEditorEnvironmentButtons';

const PageEditorDisplay: React.FC = () => {
  const localPage = useAppSelector((state) => state.pageEditor);

  const getContainerWidth = () => {
    if (localPage.activePrefix === undefined) return 'w-[450px]';
    if (localPage.activePrefix === 'md') return 'w-[1000px]';
    if (localPage.activePrefix === 'xl') return 'w-full';
    return 'w-[450px]';
  };

  return (
    <Container TwClassName='flex-col box-border m-4 flex-10 h-[calc(100vh-50px)] overflow-scroll'>
      <PageEditorEnvironmentButtons />
      <Container
        TwClassName={`${localPage?.localPageObjectFromDb?.pageBg} flex-col flex-grow mx-auto ${getContainerWidth()}`}
        animation={{ 
          entranceExit: {
            entranceAnimation: localPage?.localPageObjectFromDb?.pageEntranceAnimation,
            exitAnimation: localPage?.localPageObjectFromDb?.pageExitAnimation,
            isEntering: localPage.enterExit,
          }
        }}
      >
        <PageContentRenderer 
          content={localPage?.localPageObjectFromDb?.content} 
          cmsMode={true}
          activePrefix={localPage.activePrefix}
        />
      </Container>
    </Container>
  );
};

export default PageEditorDisplay;