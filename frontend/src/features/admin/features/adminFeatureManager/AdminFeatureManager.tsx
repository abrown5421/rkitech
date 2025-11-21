import { Box, Button, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { AdminFeatureManagerProps } from './adminFeatureManagerTypes';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useAppDispatch } from '../../../../store/hooks';
import { registerForm } from '../../../dynamicForm/dynamicFormRegistry';
import { openDynamicForm } from '../../../dynamicForm/dynamicFormSlice';

const AdminFeatureManager = <TItem,>({
  editorName,
  editorBody = "",
  editorItems = [],
  orientation = 'row',
  renderItem,
  onCreate,
  formConfig,
}: AdminFeatureManagerProps<TItem>) => {
  const dispatch = useAppDispatch();
  const {data: theme} = useGetActiveThemeQuery();
  
  const handleNewForm = () => {
    if (formConfig) {
      openFormWithConfig();
    } else {
      onCreate?.();
    }
  };

  const openFormWithConfig = (item?: TItem) => {
    if (!formConfig) return;

    const formID = item 
      ? `edit-${editorName}-${Date.now()}` 
      : `new-${editorName}-${Date.now()}`;
    
    const initialValues = formConfig.getInitialValues 
      ? formConfig.getInitialValues(item)
      : {};

    const populatedFields = formConfig.fields.map(field => 
      populateFieldDefaults(field, initialValues)
    );

    registerForm(formID, {
      validate: formConfig.validate,
      onSubmit: (values) => {
        if (formConfig.onSubmit) {
          formConfig.onSubmit(values, item);
        }
      }
    });

    dispatch(openDynamicForm({
      open: true,
      formID,
      title: item ? `Edit ${editorName}` : `New ${editorName}`,
      screenPercentage: 60,
      backgroundColor: theme?.neutral.main || '#fff',
      formFields: populatedFields
    }));
  };

  const populateFieldDefaults = (
    field: any, 
    values: Record<string, any>
  ): any => {
    if (field.children) {
      return {
        ...field,
        children: field.children.map((child: any) => 
          populateFieldDefaults(child, values)
        )
      };
    }

    return {
      ...field,
      defaultValue: values[field.name] ?? field.defaultValue
    };
  };

  return (
    <Box sx={{ width: '100%', p: 4, boxSizing: 'border-box' }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h6" sx={{fontFamily: 'PrimaryFont' }}>
          {editorName}
        </Typography>
        <Button
          sx={{
            backgroundColor: theme?.primary.main,
            border: '1px solid transparent',
            color: theme?.primary.content,
            '&:hover': {
              backgroundColor: theme?.neutral.main,
              color: theme?.primary.main,
              borderColor: theme?.primary.main,
            },
          }}
          startIcon={<AddIcon />}
          onClick={() => handleNewForm()}
        >
          Add New
        </Button>
      </Box>
      <Divider sx={{my: 3}} />
      {editorBody != "" && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {editorBody}
        </Typography>
      )}
      <Box sx={{
          display: 'flex',
          flexDirection: orientation,
          width: '100%',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'flex-start', 
      }}>
        {editorItems.map((item, index) =>
          renderItem ? renderItem(item, index, openFormWithConfig) : null
        )}
      </Box>
    </Box>
  );
};

export default AdminFeatureManager;