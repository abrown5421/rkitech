import type { FieldConfig } from '../../../dynamicForm/dynamicFormTypes';
import type { IPage } from '../../../page/pageTypes';

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

export const getPageFormConfig = (theme?: any) => ({
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
    
    if (!values.pageName?.trim()) errors.pageName = 'Page Name is required';
    if (!values.pagePath?.trim()) errors.pagePath = 'Page Path is required';
    else if (!values.pagePath.startsWith('/')) errors.pagePath = 'Page Path must start with /';
    if (!values.pageColor?.trim()) errors.pageColor = 'Page Background Color is required';
    if (!values.pageRenderMethod) errors.pageRenderMethod = 'Render Method is required';

    return Object.keys(errors).length ? errors : null;
  }
});
