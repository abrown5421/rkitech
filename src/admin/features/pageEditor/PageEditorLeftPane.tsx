import React, { useEffect } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { SelectField } from '../../../components/selectField/SelectField';
import { setActiveEditingPage } from './slices/activeEditingPageSlice';
import Icon from '../../../components/Icon/Icon';
import type { Editor } from './types/pageEditorLeftPaneTypes';

const PageLeftPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const containerAnimations = useAdminPageTransitionHook();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const activeEditingPageId = useAppSelector((state) => state.admin.activeEditingPage.activeEditingPageId);
  const activeEditingNode = useAppSelector((state) => state.admin.activeEditingNode);

  const editors: Editor[] = [
    { editorName: 'Default', editorIcon: '', editor: 'default' },
    { editorName: 'Text', editorIcon: <Icon name="TextCursor" />, editor: 'text' },
    { editorName: 'Container', editorIcon: <Icon name="Box" />, editor: 'container' },
    { editorName: 'Image', editorIcon: <Icon name="Image" />, editor: 'image' },
    { editorName: 'Button', editorIcon: <Icon name="Power" />, editor: 'button' },
    { editorName: 'Icon', editorIcon: <Icon name="Star" />, editor: 'icon' }
  ];

  const activeEditor = editors.find(
    (editor) => editor.editor === activeEditingNode.nodeType
  );

  useEffect(() => {
    const findHomePageID = pages.find((page) => page.pageName === 'Home');
    if (findHomePageID?.pageID) {
      dispatch(setActiveEditingPage({ key: 'activeEditingPageName', value: findHomePageID.pageName }));
      dispatch(setActiveEditingPage({ key: 'activeEditingPageId', value: findHomePageID.pageID }));
    }
  }, [dispatch, pages]);

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
        twClasses={['mb-4']}
      />
      {activeEditor && (
        <div className="flex items-center gap-2 px-2">
          {activeEditor.editorIcon}
          <span>{activeEditor.editorName} Editor</span>
        </div>
      )}
    </Container>
  );
};

export default PageLeftPane;
