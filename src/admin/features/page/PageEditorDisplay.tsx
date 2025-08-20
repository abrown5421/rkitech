import React, { useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';
import Container from '../../../shared/components/container/Container';

const PageEditorDisplay: React.FC = () => {
  const localPage = useAppSelector((state) => state.pageEditor.localPageObjectFromDb);

  useEffect(()=>{console.log(localPage)}, [localPage])
  
    return (
      <Container TwClassName='flex-col box-border m-4 flex-10 h-[calc(100vh-50px)] overflow-scroll'>
        <Container TwClassName='flex-row text-white mb-4'>buttons</Container>
        <Container
          TwClassName={`${localPage?.pageBg} flex-col flex-grow`}
          animation={{ entranceExit: {
              entranceAnimation: localPage?.pageEntranceAnimation,
              exitAnimation: localPage?.pageExitAnimation,
              isEntering: true,
          }}}
        >
          <PageContentRenderer content={localPage?.content} />
        </Container>
      </Container>
    );
};
export default PageEditorDisplay;
