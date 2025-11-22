import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimBox from '../../components/animBox/AnimBox';
import {
    Box,
    Divider,
    IconButton,
    Typography,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Switch,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    FormHelperText,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { closeDynamicForm, preCloseDynamicForm } from './dynamicFormSlice';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import type { FieldConfig } from './dynamicFormTypes';
import { getFormCallbacks } from './dynamicFormRegistry';
import { openAlert } from '../alert/alertSlice';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import FontPicker from '../../components/fontPicker/FontPicker';
import { AnimationPicker } from '../../components/animationPicker/AnimationPicker';

const DynamicForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data: theme } = useGetActiveThemeQuery();
    const dynamicForm = useAppSelector((state) => state.DynamicForm);
    const isClosing = dynamicForm.isClosing;

    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    
    const setNestedValue = (obj: Record<string, any>, path: string, value: any) => {
        const keys = path.split('.');
        let current = obj;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        });
    };

    const getAllLeafFields = (fields: FieldConfig[]): FieldConfig[] => {
        const leafFields: FieldConfig[] = [];
        
        const traverse = (field: FieldConfig) => {
            if (field.children && field.children.length > 0) {
            field.children.forEach(traverse);
            } else {
                leafFields.push(field);
            }
        };
        
        fields.forEach(traverse);
        return leafFields;
        };

    useEffect(() => {
        if (dynamicForm.open) {
            const initialValues: Record<string, any> = {};
            const leafFields = getAllLeafFields(dynamicForm.formFields);
            
            leafFields.forEach((field) => {
                setNestedValue(initialValues, field.name, field.defaultValue ?? '');
            });
            
            console.log("Initialized Form Values:", initialValues);
            setFormValues(initialValues);
        }
    }, [dynamicForm.open, dynamicForm.formFields]);

    if (!dynamicForm.open && !isClosing) return null;

    const handleClose = () => {
        dispatch(preCloseDynamicForm());
        const duration = 1000;
        setTimeout(() => {
            dispatch(closeDynamicForm());
        }, duration);
    };

    const handleChange = (name: string, value: any) => {
        setFormValues((prev) => {
            if (name.includes('.')) {
                const keys = name.split('.');
                const newValues = { ...prev };
                
                let current: any = newValues;
                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (!current[key] || typeof current[key] !== 'object') {
                        current[key] = {};
                    }
                    current[key] = { ...current[key] };
                    current = current[key];
                }
                
                current[keys[keys.length - 1]] = value;
                return newValues;
            }
            
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = () => {
        if (!dynamicForm.formID) return;

        const { validate, onSubmit, mode, item } = getFormCallbacks(dynamicForm.formID);

        let hasError = false;

        if (validate) {
            const errors = validate(formValues) || {};
            setFormErrors(errors);
            hasError = Object.keys(errors).length > 0;
            
            if (hasError) {
            dispatch(
                openAlert({
                body: 'There was a problem submitting your form',
                closeable: true,
                severity: 'error',
                orientation: 'bottom-right'
                })
            );
            }
        }

        if (hasError) return;

        if (onSubmit) {
            onSubmit(formValues, mode || 'create', item); 
            dispatch(
            openAlert({
                body: `${dynamicForm.title} ${mode === 'update' ? 'updated' : 'created'} successfully!`,
                closeable: true,
                severity: 'success',
                orientation: 'bottom-right'
            })
            );
        }

        handleClose();
    };

    const getNestedValue = (obj: Record<string, any>, path: string): any => {
        if (!path.includes('.')) {
            return obj[path];
        }
        
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current === undefined || current === null) {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    };

    const renderField = (field: FieldConfig) => {
        const errorText = formErrors[field.name];
        const fieldValue = getNestedValue(formValues, field.name);
        const commonProps = {
            fullWidth: true,
            margin: 'normal' as const,
            label: field.label,
            value: formValues[field.name] ?? '',
            required: field.required,
            helperText: errorText || field.helperText,
            error: !!errorText,
            onChange: (e: any) => handleChange(field.name, e.target.value),
        };

        switch (field.type) {
            case 'row':
            case 'column':
            case 'group':
                return (
                    <Box
                    key={field.name ?? Math.random()}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: field.direction ?? (field.type === 'row' ? 'row' : 'column'),
                        gap: field.gap ?? 2,
                        ...field.containerSx,
                    }}
                    >
                    {field.children?.map((child) => renderField(child))}
                    </Box>
                );
            case 'text':
            case 'number':
            case 'password':
            case 'email':
                return <TextField {...field.inputProps} size="small" {...commonProps} type={field.type} key={field.name} />;

            case 'textarea':
                return <TextField size="small" {...commonProps} multiline rows={4} key={field.name} />;

            case 'select':
                return (
                    <TextField size="small" {...commonProps} select key={field.name}>
                        {field.options?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case 'checkbox':
                return (
                    <FormControlLabel
                        key={field.name}
                        control={
                            <Checkbox
                                checked={!!formValues[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                            />
                        }
                        label={field.label}
                    />
                );

            case 'switch':
                return (
                    <FormControlLabel
                        key={field.name}
                        control={
                            <Switch
                                checked={!!formValues[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                            />
                        }
                        label={field.label}
                    />
                );

            case 'radio':
                return (
                    <FormControl key={field.name} component="fieldset" margin="normal" error={!!errorText}>
                        <FormLabel>{field.label}</FormLabel>
                        <RadioGroup
                            value={formValues[field.name]}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                            {field.options?.map((opt) => (
                                <FormControlLabel
                                    key={opt.value}
                                    value={opt.value}
                                    control={<Radio />}
                                    label={opt.label}
                                />
                            ))}
                        </RadioGroup>
                        {errorText && <FormHelperText>{errorText}</FormHelperText>}
                        {!errorText && field.helperText && <FormHelperText>{field.helperText}</FormHelperText>}
                    </FormControl>
                );

            case 'date':
                return (
                    <TextField
                        {...commonProps}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        key={field.name}
                    />
                );
            
            case 'color':
                return (
                    <ColorPicker
                        key={field.name}
                        label={field.label}
                        color={fieldValue ?? ''}
                        onChange={(val) => handleChange(field.name, val)}
                        inputProps={{...commonProps}}
                        containerSx={field.containerSx}
                    />
                );

            case 'font':
                return (
                    <FontPicker
                        key={field.name}
                        font={formValues[field.name] ?? 'PrimaryFont'}
                        onChange={(val) => handleChange(field.name, val)}
                        inputProps={{...commonProps}}
                        containerSx={field.containerSx}
                    />
                );

            case 'animation':
                const animVal = formValues[field.name] ?? { entrance: 'animate__fadeIn', exit: 'animate__fadeOut' };
                return (
                    <AnimationPicker
                        key={field.name}
                        entrance={animVal.entrance}
                        exit={animVal.exit}
                        onEntChange={(val) => handleChange(field.name, { ...animVal, entrance: val })}
                        onExtChange={(val) => handleChange(field.name, { ...animVal, exit: val })}
                        inputProps={{...commonProps}}
                        containerSx={field.containerSx}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AnimBox
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: !isClosing,
            }}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 5,
                bgcolor: 'rgba(7, 7, 8, 0.6)',
                position: 'absolute',
                top: 0,
                overflow: 'auto'
            }}
            onClick={handleClose}
        >
            <AnimBox
                animationObject={{
                    entranceAnimation: dynamicForm.entrance || 'animate__fadeInUpBig',
                    exitAnimation: dynamicForm.exit || 'animate__fadeOutDownBig',
                    isEntering: dynamicForm.open && !isClosing,
                }}
                sx={{
                    width: `${dynamicForm.screenPercentage}%`,
                    bgcolor: dynamicForm.backgroundColor || theme?.neutral.main,
                    boxShadow: 3,
                    overflow: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxHeight: '95vh',
                        position: 'relative',
                        boxSizing: 'border-box',
                        p: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '1.25rem',
                                fontFamily: 'PrimaryFont',
                                color: theme?.neutral.content,
                            }}
                        >
                            {dynamicForm.title}
                        </Typography>

                        <IconButton
                            onClick={handleClose}
                            sx={{
                                padding: 0,
                                color: theme?.neutral.content,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ my: 2 }} />

                    {dynamicForm.formFields.map(renderField)}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </AnimBox>
        </AnimBox>
    );
};

export default DynamicForm;
