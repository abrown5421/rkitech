import React, { useState } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import Text from '../../../components/text/Text';
import { InputField } from '../../../components/InputField/InputField';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { SelectField } from '../../../components/selectField/SelectField';
import type { PageFormErrorState, PageFormField, PageFormFullState } from './pagesTypes';
import { setAlert } from '../../../components/alert/alertSlice';
import Button from '../../../components/button/Button';
import Loader from '../../../components/loader/Loader';
import { insertDataIntoCollection, insertDataIntoDocumentFieldArray } from '../../../services/database/createData';
import newPageTemplate from './pageTemplate.json';

const PagesMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const containerAnimations = useAdminPageTransitionHook();
    const menus = useAppSelector((state) => state.initialApp.menus)
    const [selectedMenu, setSelectedMenu] = useState<{ menuID: string; menuName: string } | null>(null);
    const [newPageLoadState, setNewPageLoadState] = useState<boolean>(false);
    const [formState, setFormState] = useState<PageFormFullState>({
      values: {
        pageName: '',
        pageSlug: '',
        pageOrder: '',
      },
      errors: {},
      helpers: {},
    });

    const validateForm = (): boolean => {
      const newErrors: PageFormErrorState = {};

      if (!formState.values.pageName.trim()) {
        newErrors.pageName = 'Page name is required.';
      }

      if (selectedMenu !== null) {
        if (!formState.values.pageSlug.trim()) {
          newErrors.pageSlug = 'Slug is required.';
        }

        if (!formState.values.pageOrder.trim()) {
          newErrors.pageOrder = 'Order is required.';
        }
      }

      setFormState((prev) => ({
        ...prev,
        errors: newErrors,
      }));

      return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: PageFormField, value: string) => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: value,
        },
        errors: {
          ...prev.errors,
          [field]: undefined, 
        },
      }));
    };

    const handleAddNewPage = async () => {
      setNewPageLoadState(true);

      const isValid = validateForm();
      if (!isValid) {
        setNewPageLoadState(false);
        dispatch(setAlert({
          open: true,
          severity: 'error',
          message: 'Form is invalid. Fix errors before proceeding.',
        }));
        return;
      }

      try {
        const parsedContent = JSON.parse(JSON.stringify(newPageTemplate));
        parsedContent.children[0].props.text = formState.values.pageName;

        const pageObj = {
          pageName: formState.values.pageName,
          pageActive: true,
          pageContent: parsedContent,
          animationConfig: containerAnimations,
        }

        const menuObj = {
          itemName: formState.values.pageName,
          itemOrder: formState.values.pageOrder,
          itemSlug: formState.values.pageSlug,
          itemType: 'Page',
        }

        const promises: Promise<any>[] = [
          insertDataIntoCollection('Pages', pageObj),
        ];

        if (selectedMenu?.menuID) {
          console.log('menu detected')
          promises.push(
            insertDataIntoDocumentFieldArray('Menus', selectedMenu.menuID, 'menuItems', menuObj)
          );
        }

        await Promise.all(promises);

        setNewPageLoadState(false);
        dispatch(setAlert({
          open: true,
          severity: 'success',
          message: 'Page created successfully!',
        }));
      } catch (error) {
        console.error('Error creating page:', error);
        setNewPageLoadState(false);
        dispatch(setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while creating the page.',
        }));
      }
    };

      return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-col bg-gray-50 flex-grow"]}>
            <Text text='Add New Page' twClasses={["mt-2 font-bold text-lg text-amber-500"]} />
            <Container twClasses={['']}>
            <InputField
                label="Page Name"
                onChange={(e) => handleInputChange('pageName', e.target.value)}
                error={!!formState.errors.pageName}
                errorText={formState.errors.pageName}
                helperText={formState.helpers.pageName}
                size="md"
                variant="outline"
                twClasses={["flex flex-1 mb-4"]}
            />

            <SelectField
              label="Menu"
              name="menu"
              value={selectedMenu ? JSON.stringify(selectedMenu) : ''}
              onChange={(val) => {
                if (val) {
                  const parsed = JSON.parse(val as string);
                  setSelectedMenu(parsed);
                } else {
                  setSelectedMenu(null);
                }
              }}
              placeholder="No menu"
              options={[
                { label: 'No menu', value: '' },
                ...menus.map((menu) => ({
                  label: menu.menuName,
                  value: JSON.stringify({ menuID: menu.menuID, menuName: menu.menuName }),
                })),
              ]}
              twClasses={['mb-4']}
            />

            {selectedMenu && (
              <Container
                twClasses={[""]}
              >
                <InputField
                  label="Page Slug"
                  name="pageSlug"
                  value={formState.values.pageSlug}
                  onChange={(e) => handleInputChange('pageSlug', e.target.value)}
                  error={!!formState.errors.pageSlug}
                  errorText={formState.errors.pageSlug}
                  helperText={formState.helpers.pageSlug}
                  size="md"
                  variant="outline"
                  twClasses={["flex flex-1 mb-4"]}
                />

                <InputField
                  label="Page Order"
                  name="pageOrder"
                  type="number"
                  min={1}
                  value={formState.values.pageOrder}
                  onChange={(e) => handleInputChange('pageOrder', e.target.value)}
                  error={!!formState.errors.pageOrder}
                  errorText={formState.errors.pageOrder}
                  helperText={formState.helpers.pageOrder}
                  size="md"
                  variant="outline"
                  twClasses={["flex flex-1 mb-4"]}
                />
              </Container>
            )}

            <Button
                label={newPageLoadState ? <Loader variant='pulse' colorName='gray' colorIntensity={50} size={7}/> : "Add New page"}
                twClasses={['bg-amber-500 w-full text-white p-2']}
                action={handleAddNewPage}
            />

            </Container>
         </Container>
     );
};
export default PagesMenu;
