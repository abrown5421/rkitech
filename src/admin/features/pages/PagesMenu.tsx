import React, { useState } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import Text from '../../../components/text/Text';
import { InputField } from '../../../components/InputField/InputField';
import type { PageFormState } from './pagesTypes';
import Button from '../../../components/button/Button';
import { insertDataIntoCollection } from '../../../services/database/createData';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAlert } from '../../../components/alert/alertSlice';
import Loader from '../../../components/loader/Loader';
import { SelectField } from '../../../components/selectField/SelectField';

const PagesMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const containerAnimations = useAdminPageTransitionHook();
    const menus = useAppSelector((state) => state.initialApp.menus)
    const [selectedMenu, setSelectedMenu] = useState<string>('');
    const [newPageLoadState, setNewPageLoadState] = useState<boolean>(false);
    const [formState, setFormState] = useState<PageFormState>({
        pageName: '',
        pageSlug: '',
        pageOrder: '',
    });
    const [errors, setErrors] = useState<{
        pageName?: string;
        pageSlug?: string;
        pageOrder?: string;
    }>({});

    const handleInputChange = (field: keyof PageFormState) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormState(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
      
        if (!formState.pageName.trim()) {
          newErrors.pageName = 'Page Name is required';
        }
      
        if (selectedMenu !== '') {
          if (!formState.pageSlug.trim()) {
            newErrors.pageSlug = 'Page Slug is required';
          }
        
          if (!formState.pageOrder.trim()) {
            newErrors.pageOrder = 'Page Order is required';
          } else if (isNaN(Number(formState.pageOrder)) || Number(formState.pageOrder) <= 0) {
            newErrors.pageOrder = 'Page Order must be a positive number';
          }
        }
      
        setErrors(newErrors);
      
        return Object.keys(newErrors).length === 0;
    };
      
    const handleAddNewPage = async () => {
        if (!validateForm()) {
          dispatch(setAlert({
            open: true,
            severity: 'error',
            message: 'There were errors in your form.',
          }));
          return;
        }
      
        setNewPageLoadState(true);
      
        try {
          const newPageObject = {
            pageName: formState.pageName,
            pageSlug: formState.pageSlug,
            pageOrder: Number(formState.pageOrder),
            pageActive: true,
            pageContent: {
              "children": [
                {
                  "type": "Text",
                  "props": {
                    "text": formState.pageName
                  }
                }
              ],
              "type": "Container",
              "props": {
                "twClasses": [
                  { "classProperty": "padding", "classDefinition": "pt-4 pr-2 pb-4 pl-2" },
                  { "classProperty": "backgroundColor", "classDefinition": "bg-gray-50" },
                  { "classProperty": "height", "classDefinition": "h-full" },
                  { "classProperty": "position", "classDefinition": "relative" },
                  { "classProperty": "zIndex", "classDefinition": "z-0" }
                ]
              }
            },
            animationConfig: containerAnimations
          };
          await insertDataIntoCollection('Pages', newPageObject);
          dispatch(setAlert({
            open: true,
            severity: 'success',
            message: `${formState.pageName} page created successfully`,
          }));
          setFormState({
            pageName: '',
            pageSlug: '',
            pageOrder: '',
          });
          setErrors({});
        } catch (error) {
          dispatch(setAlert({
            open: true,
            severity: 'error',
            message: `Failed to create page: ${formState.pageName}`,
          }));
        } finally {
          setNewPageLoadState(false);
        }
      };

      return (
         <Container animationObject={containerAnimations} twClasses={["flex flex-col bg-gray-50 flex-grow"]}>
            <Text text='Add New Page' twClasses={["mt-2 font-bold text-lg text-amber-500"]} />
            <Container twClasses={['']}>
            <InputField
                label="Page Name"
                value={formState.pageName}
                onChange={handleInputChange('pageName')}
                error={!!errors.pageName}
                errorText={errors.pageName}
                size="md"
                variant="outline"
                twClasses={["flex flex-1 mb-4"]}
            />

            <SelectField
              label="Menu"
              name="menu"
              value={selectedMenu}
              onChange={(val) => setSelectedMenu(val as string)}
              placeholder='No menu'
              options={[
                { label: 'No menu', value: '' }, 
                ...menus.map((menu) => ({
                  label: menu.menuName,
                  value: menu.menuName,
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
                  value={formState.pageSlug}
                  onChange={handleInputChange('pageSlug')}
                  error={!!errors.pageSlug}
                  errorText={errors.pageSlug}
                  size="md"
                  variant="outline"
                  twClasses={["flex flex-1 mb-4"]}
                />

                <InputField
                  label="Page Order"
                  value={formState.pageOrder}
                  onChange={handleInputChange('pageOrder')}
                  type="number"
                  min={1}
                  error={!!errors.pageOrder}
                  errorText={errors.pageOrder}
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
