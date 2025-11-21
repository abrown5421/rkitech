import type { FieldConfig } from "../../../dynamicForm/dynamicFormTypes";
import type { FormMode } from "../../../dynamicForm/dynamicFormTypes";
import type { IPage } from '../../../page/pageTypes';
import type { PageCreateInput } from './adminPagesPageTypes';

export const pageFormFields: FieldConfig[] = [
  {
    name: 'pageName',
    label: 'Page Name',
    type: 'text',
    required: true,
    helperText: 'Enter a descriptive name for the page'
  },
  {
    name: 'pagePath',
    label: 'Page Path',
    type: 'text',
    required: true,
    helperText: 'Enter the URL path (e.g., /about)'
  },
  {
    name: 'pageRenderMethod',
    label: 'Render Method',
    type: 'select',
    required: true,
    options: [
      { label: 'Dynamic', value: 'dynamic' },
      { label: 'Static', value: 'static' }
    ],
    defaultValue: 'dynamic'
  },
  {
    name: 'pageActive',
    label: 'Active',
    type: 'switch',
    defaultValue: true,
    helperText: 'Toggle to activate or deactivate the page'
  },
  {
    name: 'pageColor',
    label: 'Page Background Color',
    type: 'color',
    required: true,
    helperText: 'Select the background color for the page'
  },
  {
    name: 'pageFontFamily',
    label: 'Page Font Family',
    type: 'font',
    helperText: 'Select the font family for the page'
  },
  {
    name: 'pageFontColor',
    label: 'Page Font Color',
    type: 'color',
    helperText: 'Select the font color for the page'
  },
  {
    name: 'pageAnimations',
    label: 'Page Animations',
    type: 'animation',
    helperText: 'Select entrance and exit animations for the page',
    containerSx: { mt: 3 }
  }
];

export const getPageFormConfig = (theme?: any, mutations?: any) => ({
  fields: pageFormFields.map(f => {
    if (f.name === 'pageColor') return { ...f, defaultValue: theme?.neutral.main || '#ffffff' };
    return f;
  }),

  getInitialValues: (item?: IPage) => {
    if (!item) {
      return {
        pageActive: true,
        pageRenderMethod: 'dynamic',
        pageColor: theme?.neutral.main || '#ffffff',
        pageAnimations: {
          entrance: 'animate__fadeIn',
          exit: 'animate__fadeOut'
        }
      };
    }

    return {
      _id: item._id,
      pageName: item.pageName,
      pagePath: item.pagePath,
      pageActive: item.pageActive,
      pageRenderMethod: item.pageRenderMethod,
      pageColor: item.pageColor,
      pageFontFamily: item.pageFontFamily,
      pageFontColor: item.pageFontColor,
      pageAnimations: {
        entrance: item.pageEntranceAnimation || 'animate__fadeIn',
        exit: item.pageExitAnimation || 'animate__fadeOut'
      }
    };
  },

  validate: (values: any) => {
    const errors: Record<string, string> = {};

    if (!values.pageName?.trim()) {
      errors.pageName = 'Page Name is required';
    } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(values.pageName)) {
      errors.pageName = 'Page Name must be CamelCase (start with uppercase, no spaces)';
    }

    if (!values.pagePath?.trim()) {
      errors.pagePath = 'Page Path is required';
    } else if (!values.pagePath.startsWith('/')) {
      errors.pagePath = 'Page Path must start with /';
    }

    if (!values.pageColor?.trim()) {
      errors.pageColor = 'Page Background Color is required';
    }

    if (!values.pageFontColor?.trim()) {
      errors.pageFontColor = 'Page Font Color is required';
    }

    if (!values.pageRenderMethod) {
      errors.pageRenderMethod = 'Render Method is required';
    }

    return Object.keys(errors).length ? errors : null;
  },

  onSubmit: async (values: any, mode: FormMode, item?: IPage) => {
    const { createPage, createElements, updatePage } = mutations || {};

    if (!createPage || !createElements || !updatePage) {
      console.error("Mutations not provided to formConfig");
      return;
    }

    const pageData: PageCreateInput = {
      pageName: values.pageName,
      pagePath: values.pagePath,
      pageActive: values.pageActive,
      pageRenderMethod: values.pageRenderMethod,
      pageColor: values.pageColor,
      pageContent: item?.pageContent || [],
      pageFontFamily: values.pageFontFamily,
      pageFontColor: values.pageFontColor,
      pageEntranceAnimation: values.pageAnimations?.entrance,
      pageExitAnimation: values.pageAnimations?.exit,
    };

    if (mode === 'create') {
      if (values.pageRenderMethod === 'dynamic') {
        const pageNameElement = {
          type: "typography",
          data: {
            variant: "body1",
            text: values.pageName,
          },
          name: `${values.pageName} body text`,
          parent: null,
        };

        const createdPageNameElement = await createElements(pageNameElement).unwrap();

        const rootElement = {
          type: "box",
          sx: {
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            minHeight: "calc(100vh - 50px)",
            backgroundColor: "$theme.neutral.main",
            m: 3,
          },
          children: [createdPageNameElement.data._id], 
          order: 0,
          name: `${values.pageName || "Page"} root`,
        };

        const createdRoot = await createElements(rootElement).unwrap();
        pageData.pageContent = [createdRoot.data._id];
      }
      
      return await createPage(pageData).unwrap();
    } else {
      console.log({
        id: item?._id || values._id, 
        ...pageData
      })
      return await updatePage({ 
        id: item?._id || values._id, 
        data: pageData  
      }).unwrap();
    }
  }
});