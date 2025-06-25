import React, { useEffect, useState } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { Page } from '../../../store/globalSlices/initialApp/initialAppTypes';
import { InputField } from '../../../components/InputField/InputField';
import Text from '../../../components/text/Text';
import Icon from '../../../components/Icon/Icon';
import Button from '../../../components/button/Button';
import Loader from '../../../components/loader/Loader';
import { setAlert } from '../../../components/alert/alertSlice';
import { openModal } from '../../../components/modal/modalSlice';
import CheckboxField from '../../../components/checkboxField/CheckboxField';
import { deleteDocument } from '../../../services/database/deleteData';
import type { PageWithMenu } from './pagesTypes';

export type EditablePageFields = {
  pageID: string;
  pageName: string;
  itemSlug: string;
  itemOrder: string;
  pageActive: boolean;
};

const PagesEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const containerAnimations = useAdminPageTransitionHook();
  const pages = useAppSelector(state => state.initialApp.pages);
  const menus = useAppSelector(state => state.initialApp.menus);

  const [localPageData, setLocalPageData] = useState<EditablePageFields[]>([
    { pageID: '', pageName: '', itemSlug: '', itemOrder: '', pageActive: false },
  ]);

  const [deleteLoad, setDeleteLoad] = useState<{ loading: boolean; object: string }>({
    loading: false,
    object: '',
  });

  const getPageAndMenuInfo = (pageObj: Page) => {
    const allMenuItems = menus.flatMap(menu =>
      menu.menuItems.map(item => ({ ...item, menuName: menu.menuName }))
    );
    const matchedMenuItem = allMenuItems.find(item => item.itemName === pageObj.pageName);
    return { ...pageObj, ...matchedMenuItem };
  };

  useEffect(() => {
    const combined = pages.map(page => {
      const full = getPageAndMenuInfo(page);
      return {
        pageID: page.pageID,
        pageName: full.pageName || '',
        itemSlug: full.itemSlug || '',
        itemOrder: full.itemOrder?.toString() || '',
        pageActive: full.pageActive ?? false,
      };
    });
    setLocalPageData(combined);
  }, [pages, menus]);

  const updateLocalPageData = (pageID: string, updates: Partial<EditablePageFields>) => {
    setLocalPageData(prev =>
      prev.map(page => (page.pageID === pageID ? { ...page, ...updates } : page))
    );
  };

  const handleFieldChange =
    (pageID: string, field: keyof EditablePageFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateLocalPageData(pageID, { [field]: e.target.value });
    };

  const handleCheckboxChange =
    (pageID: string, field: keyof EditablePageFields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalPageData(pageID, { [field]: e.target.checked });
    };

  const requestDelete = (pageName: string, pageID: string) => {
    setDeleteLoad({ loading: true, object: pageName });
    (window as any).confirmCallback = () => confirmDelete(pageID, pageName);
    (window as any).cancelCallback = () => {
      setDeleteLoad({ loading: false, object: '' });
    };
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
      dispatch(
        setAlert({
          open: true,
          severity: 'success',
          message: `${pageName} page deleted successfully`,
        })
      );
    } catch {
      dispatch(
        setAlert({
          open: true,
          severity: 'error',
          message: `Failed to delete page: ${pageName}`,
        })
      );
    } finally {
      setDeleteLoad({ loading: false, object: '' });
    }
  };

  const renderPageRow = (
    pageWithMenu: EditablePageFields & { menuName?: string },
    disableSlugAndOrder = false
  ) => {
    const localData = localPageData.find(p => p.pageID === pageWithMenu.pageID) ?? {
      pageName: '',
      itemSlug: '',
      itemOrder: '',
      pageActive: false,
      pageID: '',
    };

    return (
      <Container
        key={pageWithMenu.pageID}
        twClasses={['flex flex-row w-full justify-between items-center p-2 gap-4 items-center']}
      >
        <InputField
          label="Page Name"
          value={localData.pageName}
          onChange={handleFieldChange(pageWithMenu.pageID, 'pageName')}
          size="md"
          variant="outline"
          twClasses={['flex flex-1']}
        />

        <InputField
          label={disableSlugAndOrder ? 'No Slug' : 'Page Slug'}
          value={localData.itemSlug}
          onChange={handleFieldChange(pageWithMenu.pageID, 'itemSlug')}
          size="md"
          variant={disableSlugAndOrder ? 'filled' : 'outline'}
          disabled={disableSlugAndOrder}
          twClasses={['flex flex-1']}
        />

        <InputField
          label={disableSlugAndOrder ? 'No Order' : 'Page Order'}
          value={localData.itemOrder}
          onChange={handleFieldChange(pageWithMenu.pageID, 'itemOrder')}
          size="md"
          variant={disableSlugAndOrder ? 'filled' : 'outline'}
          disabled={disableSlugAndOrder}
          twClasses={['flex flex-1']}
        />

        <CheckboxField
          name="pageActive"
          label="Active:"
          checked={localData.pageActive}
          onChange={handleCheckboxChange(pageWithMenu.pageID, 'pageActive')}
          twClasses={['border', 'border-amber-500', 'checked:bg-amber-500', 'checked:border-amber-500']}
        />

        <Button
          label={
            deleteLoad.loading && deleteLoad.object === pageWithMenu.pageName ? (
              <Loader variant="clip" colorName="amber" colorIntensity={500} size={25} />
            ) : (
              <Icon name="Trash2" colorName="amber" colorIntensity={500} />
            )
          }
          action={() => requestDelete(pageWithMenu.pageName, pageWithMenu.pageID)}
          twClasses={['']}
        />
      </Container>
    );
  };

  

  const normalizePageWithMenu = (page: any): PageWithMenu => ({
    pageID: page.pageID,
    pageName: page.pageName || '',
    itemSlug: page.itemSlug || '',
    itemOrder: (page.itemOrder !== undefined && page.itemOrder !== null ? String(page.itemOrder) : ''),
    pageActive: page.pageActive ?? false,
    menuName: page.menuName,
  });
  
  const enrichedPages = pages.map(page => normalizePageWithMenu(getPageAndMenuInfo(page)));

  return (
    <Container animationObject={containerAnimations} twClasses={['flex flex-col bg-gray-50 flex-grow overflow-scroll']}>
      {menus.map(menu => (
        <Container key={menu.menuName} twClasses={['mb-4']}>
          <Text text={menu.menuName} twClasses={['p-2 font-bold text-lg text-amber-500']} />

          {enrichedPages
            .filter(page => page.menuName === menu.menuName)
            .sort((a, b) => (Number(a.itemOrder) || 0) - (Number(b.itemOrder) || 0))
            .map(pageWithMenu => renderPageRow(pageWithMenu))}
        </Container>
      ))}

      <Container twClasses={['mb-4']}>
        <Text text="Pages Not In A Menu" twClasses={['p-2 font-bold text-lg text-amber-500']} />

        {enrichedPages
          .filter(page => !page.menuName)
          .map(pageWithMenu => renderPageRow(pageWithMenu, true))}
      </Container>
    </Container>
  );
};

export default PagesEditor;
