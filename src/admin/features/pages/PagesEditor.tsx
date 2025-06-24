import React, { useState } from 'react';
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

const PagesEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const containerAnimations = useAdminPageTransitionHook();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const menus = useAppSelector((state) => state.initialApp.menus);
  const [pendingDeletePage, setPendingDeletePage] = useState<string | null>(null);
  const [deleteLoad, setDeleteLoad] = useState<{ loading: boolean; object: string }>({
    loading: false,
    object: '',
    });

  const getPageAndMenuInfo = (pageObj: Page) => {
    const menuMatch = menus
      .flatMap(menu => menu.menuItems.map(item => ({ ...item, menuName: menu.menuName })))
      .find(item => item.itemName === pageObj.pageName);
    return { ...pageObj, ...menuMatch };
  };

  const [localPageData, setLocalPageData] = useState<Record<string, Record<string, string>>>(
    () =>
      Object.fromEntries(
        pages.map(page => {
          const full = getPageAndMenuInfo(page);
          return [page.pageID, {
            pageName: full.pageName || '',
            itemSlug: full.itemSlug || '',
            itemOrder: full.itemOrder?.toString() || '',
          }];
        })
      )
  );

  const handleFieldChange = (pageID: string, field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalPageData(prev => ({
      ...prev,
      [pageID]: {
        ...prev[pageID],
        [field]: e.target.value,
      },
    }));
  };

  const requestDelete = (pageName: string) => {
    setDeleteLoad({ loading: true, object: pageName });
    setPendingDeletePage(pageName);
    (window as any).confirmCallback = () => confirmDelete();
    (window as any).cancelCallback = () => {
        setDeleteLoad({ loading: false, object: '' });
        setPendingDeletePage(null);
    };
    dispatch(openModal({
        modalID: 'confirmOrDeny',
        modalTitle: 'Confirm Deletion',
        modalBody: `Are you sure you want to delete the "${pageName}" page? This action cannot be undone.`,
    }));
  };

  const confirmDelete = () => {
    if (!pendingDeletePage) return;

    setTimeout(() => {
        dispatch(setAlert({
        open: true,
        severity: 'success',
        message: `${pendingDeletePage} page deleted successfully`,
        }));
        setDeleteLoad({ loading: false, object: '' });
        setPendingDeletePage(null);
    }, 1000);
  };
  
  return (
    <Container animationObject={containerAnimations} twClasses={["flex flex-col bg-gray-50 flex-grow overflow-scroll"]}>
      {menus.map((menu) => (
        <Container key={menu.menuName} twClasses={["mb-4"]}>
            <Text text={menu.menuName} twClasses={["p-2 font-bold text-lg text-amber-500"]} />
            
            {pages
            .map(page => getPageAndMenuInfo(page))
            .filter(pageWithMenu => pageWithMenu.menuName === menu.menuName)
            .sort((a, b) => {
                const orderA = Number(a.itemOrder) || 0;
                const orderB = Number(b.itemOrder) || 0;
                return orderA - orderB;
            })
            .map(pageWithMenu => (
                <Container
                    key={pageWithMenu.pageID}
                    twClasses={["flex flex-row w-full justify-between items-center p-2 gap-4 items-center"]}
                >
                    <InputField
                        label="Page Name"
                        value={localPageData[pageWithMenu.pageID]?.pageName ?? ''}
                        onChange={handleFieldChange(pageWithMenu.pageID, 'pageName')}
                        size="md"
                        variant="outline"
                        twClasses={["flex flex-1"]}
                    />

                    <InputField
                        label="Page Slug"
                        value={localPageData[pageWithMenu.pageID]?.itemSlug ?? ''}
                        onChange={handleFieldChange(pageWithMenu.pageID, 'itemSlug')}
                        size="md"
                        variant="outline"
                        twClasses={["flex flex-1"]}
                    />

                    <InputField
                        label="Page Order"
                        value={localPageData[pageWithMenu.pageID]?.itemOrder ?? ''}
                        onChange={handleFieldChange(pageWithMenu.pageID, 'itemOrder')}
                        size="md"
                        variant="outline"
                        twClasses={["flex flex-1"]}
                    />
                    <Button
                        label={
                            deleteLoad.loading && deleteLoad.object === pageWithMenu.pageName
                            ? <Loader variant="clip" colorName="amber" colorIntensity={500} size={25} />
                            : <Icon name="Trash2" color="#FE9A00" />
                        }
                        action={() => requestDelete(pageWithMenu.pageName)}
                        twClasses={['']}
                    />
                </Container>
            ))}
        </Container>
    ))}
    <Container twClasses={["mb-4"]}>
        <Text text="Pages Not In A Menu" twClasses={["p-2 font-bold text-lg text-amber-500"]} />

        {pages
            .map(page => getPageAndMenuInfo(page))
            .filter(pageWithMenu => !pageWithMenu.menuName)
            .map(pageWithMenu => (
            <Container
                key={pageWithMenu.pageID}
                twClasses={["flex flex-row w-full justify-between items-center p-2 gap-4 items-center"]}
            >
                <InputField
                    label="Page Name"
                    value={localPageData[pageWithMenu.pageID]?.pageName ?? ''}
                    onChange={handleFieldChange(pageWithMenu.pageID, 'pageName')}
                    size="md"
                    variant="outline"
                    twClasses={["flex flex-1"]}
                />

                <InputField
                    label="No Slug"
                    value={localPageData[pageWithMenu.pageID]?.itemSlug ?? ''}
                    onChange={handleFieldChange(pageWithMenu.pageID, 'itemSlug')}
                    size="md"
                    variant="outline"
                    disabled
                    twClasses={["flex flex-1"]}
                />

                <InputField
                    label="No Order"
                    value={localPageData[pageWithMenu.pageID]?.itemOrder ?? ''}
                    onChange={handleFieldChange(pageWithMenu.pageID, 'itemOrder')}
                    size="md"
                    variant="outline"
                    disabled
                    twClasses={["flex flex-1"]}
                />
                <Button
                label={
                    deleteLoad.loading && deleteLoad.object === pageWithMenu.pageName
                    ? <Loader variant="clip" colorName="amber" colorIntensity={500} size={25} />
                    : <Icon name="Trash2" color="#FE9A00" />
                }
                action={() => requestDelete(pageWithMenu.pageName)}
                twClasses={['']}
                />
            </Container>
            ))}
        </Container>
    </Container>
  );
};

export default PagesEditor;
