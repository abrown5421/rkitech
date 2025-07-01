import React, { useEffect, useState } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { InputField } from '../../../components/InputField/InputField';
import Button from '../../../components/button/Button';
import Loader from '../../../components/loader/Loader';
import { setAlert } from '../../../components/alert/alertSlice';
import { openModal } from '../../../components/modal/modalSlice';
import CheckboxField from '../../../components/checkboxField/CheckboxField';
import { deleteDocument } from '../../../services/database/deleteData';
import type { EditablePageFields } from './pagesEditorTypes';
import Text from '../../../components/text/Text';
import { useAdminNavigationHook } from '../../hooks/useAdminNavigationHook';
import { useNavigate } from 'react-router';
import { updateDataInCollection } from '../../../services/database/updateData';
import { setLoadingObject } from '../../../store/globalSlices/loadingObject/loadingObjectSlice';

const PagesEditorRightPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const menus = useAppSelector((state) => state.initialApp.menus);
  const loadingObj = useAppSelector((state) => state.loading);
  const containerAnimations = useAdminPageTransitionHook();
  const adminNavigation = useAdminNavigationHook();
  const navigate = useNavigate();

  const [localPageData, setLocalPageData] = useState<EditablePageFields[]>([]);

  useEffect(() => {
    console.log(menus)
    const combined = pages.map(page => {
    const matchingItem = menus
      .flatMap(menu => menu.menuItems || []) 
      .find(item => item.itemPageId === page.pageID);

      return {
        pageID: page.pageID,
        originalPageName: page.pageName,
        pageName: page.pageName,
        pageSlug: page.pageSlug,
        originalPageSlug: page.pageSlug,
        pageOrder: matchingItem?.itemOrder?.toString() ?? '9999',
        pageActive: page.pageActive ?? false,
      };
    });

    combined.sort((a, b) => a.pageName.localeCompare(b.pageName, undefined, { sensitivity: 'base' }));
    setLocalPageData(combined);
  }, [pages, menus]);

  const requestDelete = (pageName: string, pageID: string) => {
    dispatch(setLoadingObject({ loading: true, id: pageName }));

    (window as any).confirmCallback = () => confirmDelete(pageID, pageName);
    (window as any).cancelCallback = () =>
      dispatch(setLoadingObject({ loading: false, id: '' }));

    dispatch(
      openModal({
        modalID: 'confirmOrDeny',
        modalTitle: 'Confirm Deletion',
        modalBody: `Are you sure you want to delete the "${pageName}" page? This action cannot be undone.`,
      })
    );
  };

  const confirmDelete = async (pageID: string, pageName: string) => {
    try {
      await deleteDocument('Pages', pageID);
      dispatch(setAlert({
        open: true,
        severity: 'success',
        message: `${pageName} page deleted successfully`,
      }));
    } catch {
      dispatch(setAlert({
        open: true,
        severity: 'error',
        message: `Failed to delete page: ${pageName}`,
      }));
    } finally {
      dispatch(setLoadingObject({ loading: false, id: '' }));
    }
  };

  const handleActiveToggle = async (pageID: string, isActive: boolean) => {
    dispatch(setLoadingObject({ loading: true, id: pageID }));

    try {
      await updateDataInCollection('Pages', pageID, { pageActive: isActive });

      setLocalPageData(prev =>
        prev.map(page =>
          page.pageID === pageID ? { ...page, pageActive: isActive } : page
        )
      );

      dispatch(setAlert({
        open: true,
        severity: 'success',
        message: `Page status updated successfully.`,
      }));
    } catch {
      dispatch(setAlert({
        open: true,
        severity: 'error',
        message: `Failed to update page status.`,
      }));
    } finally {
      dispatch(setLoadingObject({ loading: false, id: '' }));
    }
  };

  const handleInputChange = (id: string, key: keyof EditablePageFields, value: string) => {
    setLocalPageData(prev =>
      prev.map(page =>
        page.pageID === id ? { ...page, [key]: value } : page
      )
    );
  };

  const savePageField = async (pageID: string, key: keyof EditablePageFields, value: string) => {
    dispatch(setLoadingObject({ loading: true, id: pageID }));

    try {
      await updateDataInCollection('Pages', pageID, { [key]: value });

      dispatch(setAlert({
        open: true,
        severity: 'success',
        message: `Page ${key === 'pageName' ? 'name' : 'slug'} updated successfully.`,
      }));

      setLocalPageData(prev =>
        prev.map(page =>
          page.pageID === pageID ? { ...page, [`original${capitalizeFirstLetter(key)}`]: value } : page
        )
      );
    } catch (error) {
      console.error(`Failed to update page ${key}:`, error);
      dispatch(setAlert({
        open: true,
        severity: 'error',
        message: `Failed to update page ${key}.`,
      }));
    } finally {
      dispatch(setLoadingObject({ loading: false, id: '' }));
    }
  };

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Container animationObject={containerAnimations} twClasses={['flex flex-col bg-gray-50 flex-grow overflow-scroll p-4']}>
      {localPageData.map((page) => {
        const isSpecialPage = page.pageName === "Home" || page.pageName === "Page Not Found";
        const isLoading = loadingObj.loading && loadingObj.id === page.pageName;

        return (
          <Container key={page.pageID} twClasses={['flex flex-col w-full rounded shadow bg-gray-200 mb-4 p-3']}>
            <Container twClasses={['flex flex-row w-full justify-between']}>
              <Text text="Page Name:" twClasses={['text-sm font-medium text-gray-900 mb-2']} />
              <CheckboxField
                name="pageActive"
                label="Active:"
                checked={page.pageActive}
                twClasses={
                  isSpecialPage
                    ? ['border', 'border-gray-900', 'checked:bg-gray-500', 'checked:border-gray-900']
                    : ['border', 'border-amber-500', 'checked:bg-amber-500', 'checked:border-amber-500']
                }
                onChange={(e) => handleActiveToggle(page.pageID, e.target.checked)}
                disabled={isSpecialPage}
              />
            </Container>
            
            <Container twClasses={['flex flex-row w-full justify-between gap-3']}>
              <InputField
                value={page.pageName}
                size="md"
                variant="filled"
                twClasses={['flex flex-1 w-full mb-3']}
                disabled={isSpecialPage}
                onChange={(e) => handleInputChange(page.pageID, 'pageName', e.target.value)}
                iconEnd={
                  page.pageName !== page.originalPageName && (
                    <button
                      onClick={() => savePageField(page.pageID, 'pageName', page.pageName)}
                      className="text-xs text-amber-600 font-semibold hover:underline"
                    >
                      Save
                    </button>
                  )
                }
              />

              <InputField
                value={page.pageSlug}
                size="md"
                variant="filled"
                twClasses={['flex flex-1 w-full mb-3']}
                disabled={isSpecialPage}
                onChange={(e) => handleInputChange(page.pageID, 'pageSlug', e.target.value)}
                iconEnd={
                  page.pageSlug !== page.originalPageSlug && (
                    <button
                      onClick={() => savePageField(page.pageID, 'pageSlug', page.pageSlug)}
                      className="text-xs text-amber-600 font-semibold hover:underline"
                    >
                      Save
                    </button>
                  )
                }
              />
            </Container>
            <Container twClasses={['flex flex-row w-full gap-4']}>
              <Button
                label="Edit"
                twClasses={['bg-amber-500 text-white pl-2 pr-2 rounded']}
                action={adminNavigation('/admin/page-editor', 'Page Editor')}
              />
              <Button
                label="View"
                twClasses={['bg-gray-50 text-gray-900 pl-2 pr-2 rounded']}
                action={() => navigate(page.pageSlug)}
              />
              {!isSpecialPage && (
                <Button
                  label={
                    isLoading ? (
                      <Loader variant='pulse' colorName="gray" colorIntensity={50} size={7} />
                    ) : (
                      "Delete"
                    )
                  }
                  action={() => requestDelete(page.pageName, page.pageID)}
                  twClasses={['bg-red-700 text-white pl-2 pr-2 rounded']}
                />
              )}
            </Container>
          </Container>
        );
      })}
    </Container>
  );
};

export default PagesEditorRightPane;
