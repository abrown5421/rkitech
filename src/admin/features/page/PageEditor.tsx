import React, { useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';
import Container from '../../../shared/components/container/Container';

const PageEditor: React.FC = () => {
  const localPage = useAppSelector((state) => state.pageEditor.localPageObjectFromDb);

  useEffect(()=>{console.log(localPage)}, [localPage])
  
    return (
      <Container
        TwClassName={`${localPage?.pageBg} flex-col flex-10 h-[calc(100vh-50px)] overflow-scroll`}
        animation={{ entranceExit: {
            entranceAnimation: localPage?.pageEntranceAnimation,
            exitAnimation: localPage?.pageExitAnimation,
            isEntering: true,
        }}}
      >
        <PageContentRenderer content={localPage?.content} />
      </Container>
    );
};
export default PageEditor;
