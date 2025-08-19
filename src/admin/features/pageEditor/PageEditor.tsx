import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import type { Page } from '../../../shared/features/pages/pageTypes';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';

const PageEditor: React.FC = () => {
  const { pageComponentKey } = useParams();
  const pages = useAppSelector((state) => state.pages.pages)
  const [localPage, setLocalPage] = useState<Page>();
  
  useEffect(()=>{
    const pageForEditing = pages.find((page) => page.componentKey === pageComponentKey)
    setLocalPage(pageForEditing)
  }, [pageComponentKey])

    return (
        <PageContentRenderer content={localPage?.content} />
    );
};
export default PageEditor;
