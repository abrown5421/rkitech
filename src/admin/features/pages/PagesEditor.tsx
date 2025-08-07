import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Icon from '../../../shared/components/icon/Icon';
import { deleteDocument } from '../../../services/database/deleteData';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import Button from '../../../shared/components/button/Button';
import Loader from '../../../shared/components/loader/Loader';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';

const PagesEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const pagesFromStore = useAppSelector((state) => state.pages.pages);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isDeleting = (pageId: string) => loading && id === pageId;

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

  const deletePage = async (pageId: string, pageName: string) => {
    dispatch(setLoading({ loading: true, id: pageId }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      // await deleteDocument('Pages', pageId);

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: `${pageName} was successfully deleted.`,
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    } catch {
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: `There was a problem deleting ${pageName}.`,
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    } finally {
      dispatch(setNotLoading());
    }
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
          <Button
            onClick={() => deletePage(page.pageID, page.pageName)}
          >
            {isDeleting(page.pageID)
              ? <Loader variant="spinner" color="bg-primary" />
              : <Icon TwClassName="color-error" name="Trash" />
            }
          </Button>
        </Container>
      ))}
    </Container>
  );
};

export default PagesEditor;
