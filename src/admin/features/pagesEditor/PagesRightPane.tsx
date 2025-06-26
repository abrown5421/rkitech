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
import type { EditablePageFields } from './pagesTypes';
import type { Page } from '../../../store/globalSlices/initialApp/initialAppTypes';
import Text from '../../../components/text/Text';
import { useAdminNavigationHook } from '../../hooks/useAdminNavigationHook';
import { useNavigate } from 'react-router';
import { updateDataInCollection } from '../../../services/database/updateData';

const PagesRightPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const menus = useAppSelector((state) => state.initialApp.menus);
  const containerAnimations = useAdminPageTransitionHook();
  const adminNavigation = useAdminNavigationHook();
  const navigate = useNavigate();

  const [deleteLoad, setDeleteLoad] = useState<{ loading: boolean; object: string }>({
    loading: false,
    object: '',
  });
  
  const [localPageData, setLocalPageData] = useState<EditablePageFields[]>([
    { pageID: '', pageName: '', itemSlug: '', itemOrder: '', pageActive: false },
  ]);

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

    combined.sort((a, b) => a.pageName.localeCompare(b.pageName, undefined, { sensitivity: 'base' }));

    setLocalPageData(combined);
  }, [pages, menus]);

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

  const handleActiveToggle = async (pageID: string, isActive: boolean) => {
    try {
      await updateDataInCollection('Pages', pageID, { pageActive: isActive });
      
      setLocalPageData(prev =>
        prev.map(page =>
          page.pageID === pageID ? { ...page, pageActive: isActive } : page
        )
      );

      dispatch(
        setAlert({
          open: true,
          severity: 'success',
          message: `Page status updated successfully.`,
        })
      );
    } catch (error) {
      dispatch(
        setAlert({
          open: true,
          severity: 'error',
          message: `Failed to update page status.`,
        })
      );
    }
  };
   return (
     <Container animationObject={containerAnimations} twClasses={['flex flex-col bg-gray-50 flex-grow overflow-scroll p-4']}>
      {localPageData.map((page) => {
        const isSpecialPage = page.pageName === "Home" || page.pageName === "Page Not Found";

        return (
          <Container
            key={page.pageID}
            twClasses={['flex flex-col w-full rounded shadow bg-gray-200 mb-4 p-3']}
          >
            <Container twClasses={['flex flex-row w-full justify-between']}>
              <Text text="Page Name:" twClasses={['text-sm font-medium text-gray-900 mb-2']} />
              <CheckboxField
                name="pageActive"
                label="Active:"
                checked={page.pageActive}
                twClasses={isSpecialPage ? ['border', 'border-gray-900', 'checked:bg-gray-500', 'checked:border-gray-900'] : ['border', 'border-amber-500', 'checked:bg-amber-500', 'checked:border-amber-500']}
                onChange={(e) => handleActiveToggle(page.pageID, e.target.checked)}
                disabled={isSpecialPage} 
              />
            </Container>

            <InputField
              value={page.pageName}
              size="md"
              variant="filled"
              twClasses={['flex flex-1 w-full mb-3']}
              disabled={isSpecialPage} 
            />

            <Container twClasses={['flex flex-row w-full gap-4']}>
              <Button
                label="Edit"
                twClasses={['bg-amber-500 text-white pl-2 pr-2 rounded']}
                action={adminNavigation('/admin/page-editor', 'Page Editor')}
              />
              <Button
                label="View"
                twClasses={['bg-gray-50 text-gray-900 pl-2 pr-2 rounded']}
                action={() => navigate(page.itemSlug)}
              />
              
              {!isSpecialPage && (
                <Button
                  label={
                    deleteLoad.loading && deleteLoad.object === page.pageName ? (
                      <Loader variant="clip" colorName="gray" colorIntensity={500} size={25} />
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
export default PagesRightPane;
