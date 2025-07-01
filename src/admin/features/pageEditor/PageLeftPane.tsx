import React, { useEffect } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { SelectField } from '../../../components/selectField/SelectField';
import { setActiveEditingPage } from './activeEditingPageSlice';

const PageLeftPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const containerAnimations = useAdminPageTransitionHook();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const activeEditingPageId = useAppSelector((state) => state.admin.activeEditingPage.activeEditingPageId);

  useEffect(() => {
    const findHomePageID = pages.find((page) => page.pageName === 'Home');
    if (findHomePageID?.pageID) {
        dispatch(setActiveEditingPage({ key: 'activeEditingPageName', value: findHomePageID.pageName }));
        dispatch(setActiveEditingPage({ key: 'activeEditingPageId', value: findHomePageID.pageID }));
    }
  }, []);

  const pageOptions = pages.map((page) => ({
    label: page.pageName,
    value: page.pageID,
  }));

  const handlePageChange = (value: string | string[]) => {
    if (typeof value === 'string') {
        dispatch(setActiveEditingPage({ key: 'activeEditingPageId', value }));
    }
  };

  return (
    <Container animationObject={containerAnimations} twClasses={["flex flex-col bg-gray-50 flex-grow"]}>
      <SelectField
        label="Select Page to Edit"
        name="activeEditingPage"
        value={activeEditingPageId}
        onChange={handlePageChange}
        options={pageOptions}
        placeholder="Choose a page"
        size="md"
        variant="outline"
      />
    </Container>
  );
};

export default PageLeftPane;
