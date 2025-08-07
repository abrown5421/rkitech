import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import { useAppSelector } from '../../../app/hooks';
import Icon from '../../../shared/components/icon/Icon';

const PagesEditor: React.FC = () => {
  const pagesFromStore = useAppSelector((state) => state.pages.pages);

  const [localPages, setLocalPages] = useState(pagesFromStore);

  useEffect(() => {
    const sortedPages = [...pagesFromStore].sort((a, b) =>
        a.pageName.localeCompare(b.pageName)
    );
    setLocalPages(sortedPages);
  }, [pagesFromStore]);

  const handleFieldChange = (index: number, key: string, value: any) => {
    const updatedPages = [...localPages];
    updatedPages[index] = { ...updatedPages[index], [key]: value };
    setLocalPages(updatedPages);
  };

  return (
    <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col gap-4">
      {localPages.map((page, index) => (
        <Container
          key={page.pageID}
          TwClassName="rounded-md flex-row gap-4 items-center"
        >
          <Input
            TwClassName='flex-grow'
            label="Page Name"
            value={page.pageName}
            onChange={(e) => handleFieldChange(index, 'pageName', e.target.value)}
          />

          <Input
            TwClassName='flex-grow'
            label="Page Slug"
            value={page.pagePath}
            onChange={(e) => handleFieldChange(index, 'pagePath', e.target.value)}
          />

          <Select
            TwClassName='flex-grow'
            label="Render Method"
            value={page.pageRenderMethod}
            onChange={(e) => handleFieldChange(index, 'pageRenderMethod', e.target.value)}
          >
            <option value="static">Static</option>
            <option value="dynamic">Dynamic</option>
          </Select>

          <Checkbox
            label={page.pageActive ? "Active" : "Inactive"}
            checked={page.pageActive}
            onChange={(e) => handleFieldChange(index, 'pageActive', e.target.checked)}
          />
          <Icon TwClassName="color-error" name="Trash" />
        </Container>
      ))}
    </Container>
  );
};

export default PagesEditor;
