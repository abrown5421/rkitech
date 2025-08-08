import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteDocument } from '../../../services/database/deleteData';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import Button from '../../../shared/components/button/Button';
import Loader from '../../../shared/components/loader/Loader';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import Text from '../../../shared/components/text/Text';
import { updateDataInCollection } from '../../../services/database/updateData';
import { useNavigationHook } from '../../../hooks/useNavigationHook';

const PagesEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook()
  const pagesFromStore = useAppSelector((state) => state.pages.pages);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isToggling = (pageId: string) => loading && id === 'toggle-' + pageId;
  const isSaving = loading && id === 'save-pages';

  const [localPages, setLocalPages] = useState(pagesFromStore);
  const [originalPages, setOriginalPages] = useState(pagesFromStore);

  const hasChanges = JSON.stringify(
    localPages.map(p => ({
      pageID: p.pageID,
      pageName: p.pageName,
      pagePath: p.pagePath,
      pageRenderMethod: p.pageRenderMethod,
    }))
  ) !== JSON.stringify(
    originalPages.map(p => ({
      pageID: p.pageID,
      pageName: p.pageName,
      pagePath: p.pagePath,
      pageRenderMethod: p.pageRenderMethod,
    }))
  );

  useEffect(() => {
    const sortedPages = [...pagesFromStore].sort((a, b) =>
      a.pageName.localeCompare(b.pageName)
    );
    setLocalPages(sortedPages);
    setOriginalPages(sortedPages);
  }, [pagesFromStore]);

  const handleFieldChange = (
    index: number,
    key: string,
    value: any,
    pageId?: string,
    pageName?: string
  ) => {
    const updatedPages = [...localPages];
    updatedPages[index] = { ...updatedPages[index], [key]: value };
    setLocalPages(updatedPages);

    if (key === 'pageActive' && pageId && pageName) {
      deactivatePage(pageId, pageName, value as boolean);
    }
  };

  const handleUndo = () => {
    setLocalPages([...originalPages]);
  };

  const handleSave = async () => {
    dispatch(setLoading({ loading: true, id: 'save-pages' }));

    try {
      const updates = [];

      for (let i = 0; i < localPages.length; i++) {
        const local = localPages[i];
        const original = originalPages.find(p => p.pageID === local.pageID);

        if (
          original &&
          (local.pageName !== original.pageName ||
            local.pagePath !== original.pagePath ||
            local.pageRenderMethod !== original.pageRenderMethod)
        ) {
          updates.push(
            updateDataInCollection('Pages', local.pageID, {
              pageName: local.pageName,
              pagePath: local.pagePath,
              pageRenderMethod: local.pageRenderMethod,
            })
          );
        }
      }

      await Promise.all(updates);

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Page changes saved successfully.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        }
      }));
    } catch (error) {
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Failed to save page changes.',
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

  const deactivatePage = async (pageId: string, pageName: string, pageActive: boolean) => {
    dispatch(setLoading({ loading: true, id: 'toggle-' + pageId }));

    try {
      await updateDataInCollection('Pages', pageId, { pageActive });

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: `${pageName} was successfully ${pageActive ? 'activated' : 'deactivated'}.`,
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
        alertMessage: `There was a problem ${pageActive ? 'activating' : 'deactivating'} ${pageName}.`,
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

  const deletePage = async (pageId: string, pageName: string) => {
    dispatch(setLoading({ loading: true, id: 'delete-' + pageId }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      await deleteDocument('Pages', pageId);

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
  
  const permanentPages = localPages.filter((page) => 
    page.pageName === 'Home' || page.pageName === 'Page Not Found'
  );
  
  const nonPermanentPages = localPages.filter((page) => 
    page.pageName !== 'Auth' && 
    page.pageName !== 'Home' && 
    page.pageName !== 'Page Not Found'
  );

  const renderPageRow = (page: any, index: number, isPermanent: boolean) => {
    const isProtected = isPermanent;

    return (
      <Container TwClassName='flex-col'>
        <Container
          key={page.pageID}
          TwClassName="rounded-md flex-row gap-4 items-center"
        >
          <Input
            TwClassName='flex-grow'
            label="Page Name"
            value={page.pageName}
            disabled={isProtected}
            onChange={(e) => handleFieldChange(index, 'pageName', e.target.value)}
          />

          <Input
            TwClassName='flex-grow'
            label="Page Slug"
            value={page.pagePath}
            disabled={isProtected}
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
            checked={page.pageActive}
            disabled={isProtected || isToggling(page.pageID)}
            onChange={(e) =>
              handleFieldChange(index, 'pageActive', e.target.checked, page.pageID, page.pageName)
            }
          />
          {isToggling(page.pageID) && (
            <Container TwClassName="flex items-center justify-center bg-white/50 rounded">
              <Loader variant="spinner" color="text-amber-500" />
            </Container>
          )}

          <Text text={page.pageActive ? "Active" : "Inactive"} />
        </Container>
        <Container TwClassName='flex-row gap-4 mt-1 ml-1 mb-1'>
          <Button
            onClick={() => clientNavigation(page.pagePath, page.pageName, page.pageID)()}
            TwClassName='pt-0 pr-3 pb-0 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary flex justify-center items-center'
          >
            View 
          </Button>
          {page.pageRenderMethod === 'dynamic' && (
            <Button
              TwClassName='pt-0 pr-3 pb-0 pl-3 bg-info rounded-xl text-white border border-info hover:bg-transparent hover:text-info flex justify-center items-center'
            >
              Edit
            </Button>
          )}
          {!isProtected && (<Button
            onClick={() => deletePage(page.pageID, page.pageName)}
            TwClassName='pt-0 pr-3 pb-0 pl-3 bg-error rounded-xl text-white border border-error hover:bg-transparent hover:text-error flex justify-center items-center'
          >
            Delete
          </Button> )}
        </Container>
      </Container>
    );
  };

  return (
    <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col gap-4">
      {permanentPages.length > 0 && (
        <>
          <Text
            text="Permanent Pages"
            TwClassName="text-xl  text-gray-700 border-b border-gray-300 pb-2 font-primary"
          />
          <Text
            text="These pages are protected and cannot be deleted or renamed but they can have different render methods."
            TwClassName="text-sm text-gray-500 -mt-2 mb-2"
          />
          {permanentPages.map((page) => 
            renderPageRow(page, localPages.indexOf(page), true)
          )}
        </>
      )}

      {nonPermanentPages.length > 0 && (
        <>
          <Text
            text="Non-Permanent Pages"
            TwClassName="text-xl  text-gray-700 border-b border-gray-300 pb-2 mt-6 font-primary"
          />
          <Text
            text="These pages can be edited and deleted"
            TwClassName="text-sm text-gray-500 -mt-2 mb-2"
          />
          {nonPermanentPages.map((page) => 
            renderPageRow(page, localPages.indexOf(page), false)
          )}
        </>
      )}

      {nonPermanentPages.length === 0 && permanentPages.length === 0 && (
        <Container TwClassName='flex-row justify-center items-center w-full h-full'>
          <Loader
            variant="spinner"
            color="text-amber-500"
          />
        </Container>

      )}
      
      <Container 
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeIn animate__faster',
            exitAnimation: 'animate__fadeOut animate__faster',
            isEntering: hasChanges,
          }
        }}
        TwClassName='flex-row gap-2 justify-center'
      >
        <Button onClick={handleUndo} TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black border border-gray-200 hover:bg-transparent flex justify-center items-center">
          Undo
        </Button>
        <Button onClick={handleSave} TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-primary flex justify-center items-center">
          {isSaving ? <Loader variant='spinner' color='amber-500' /> : <>Save</>}
        </Button>
      </Container>
    </Container>
  );
};

export default PagesEditor;