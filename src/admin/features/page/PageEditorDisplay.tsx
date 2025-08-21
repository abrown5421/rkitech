import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';
import Container from '../../../shared/components/container/Container';

const PageEditorDisplay: React.FC = () => {
  const localPage = useAppSelector((state) => state.pageEditor);

    return (
      <Container TwClassName='flex-col box-border m-4 flex-10 h-[calc(100vh-50px)] overflow-scroll'>
        <Container TwClassName='flex-row text-gray-50 mb-4'>buttons</Container>
        <Container
          TwClassName={`${localPage?.localPageObjectFromDb?.pageBg} flex-col flex-grow`}
          animation={{ entranceExit: {
              entranceAnimation: localPage?.localPageObjectFromDb?.pageEntranceAnimation,
              exitAnimation: localPage?.localPageObjectFromDb?.pageExitAnimation,
              isEntering: localPage.enterExit,
          }}}
        >
          <PageContentRenderer content={localPage?.localPageObjectFromDb?.content} cmsMode={true} />
        </Container>
      </Container>
    );
};
export default PageEditorDisplay;
