import React, { useState } from 'react';
import Container from '../../../components/container/Container';
import { useAdminPageTransitionHook } from '../../hooks/useAdminPageTransition';
import Text from '../../../components/text/Text';
import { InputField } from '../../../components/InputField/InputField';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { PageFormErrorState, PageFormField, PageFormFullState } from './pagesEditorTypes';
import { setAlert } from '../../../components/alert/alertSlice';
import Button from '../../../components/button/Button';
import Loader from '../../../components/loader/Loader';
import { insertDataIntoCollection } from '../../../services/database/createData';
import newPageTemplate from './pageTemplate.json';

const PagesEditorLeftPane: React.FC = () => {
    const dispatch = useAppDispatch();
    const containerAnimations = useAdminPageTransitionHook();
    const pages = useAppSelector((state) => state.initialApp.pages)
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

      const trimmedName = formState.values.pageName.trim().toLowerCase();

      if (!trimmedName) {
        newErrors.pageName = 'Page name is required.';
      } else if (pages.some(page => page.pageName.trim().toLowerCase() === trimmedName)) {
        newErrors.pageName = 'A page with this name already exists. Please enter a unique page name.';
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

        const promises: Promise<any>[] = [
          insertDataIntoCollection('Pages', pageObj),
        ];

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

            <Button
                label={newPageLoadState ? <Loader variant='pulse' colorName='gray' colorIntensity={50} size={7}/> : "Add New page"}
                twClasses={['bg-amber-500 w-full text-white p-2 rounded']}
                action={handleAddNewPage}
            />

            </Container>
         </Container>
     );
};
export default PagesEditorLeftPane;
