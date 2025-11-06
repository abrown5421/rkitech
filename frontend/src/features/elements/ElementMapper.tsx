import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import AnimBox from '../../components/animBox/AnimBox';
import { useThemeValue } from '../../hooks/useThemeValue';
import type { ElementMapperProps } from './elementsTypes';

function resolveThemeValue(value: any) {
  if (typeof value === 'string' && value.startsWith('$theme.')) {
    return useThemeValue(value.replace('$theme.', ''));
  }
  return value;
}

function resolveThemeInObject(obj: Record<string, any> = {}) {
  const resolved: Record<string, any> = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const val = obj[key];
    resolved[key] = val && typeof val === 'object' ? resolveThemeInObject(val) : resolveThemeValue(val);
  }
  return resolved;
}

export const ElementMapper: React.FC<ElementMapperProps> = ({ element, children }) => {
   console.log(
    "%c[Element Rendered]",
    "color: #4CAF50; font-weight: bold;",
    {
      id: element?._id,
      type: element?.type,
      data: element?.data,
      props: element?.props,
      childrenCount: children ? React.Children.count(children) : 0
    }
  );
  if (!element || !element.type) {
    return (
      <Box>
        <Typography color="error">Invalid element: missing type</Typography>
      </Box>
    );
  }

  const { type, data = {}, styles, className, props, sx } = element;

  const resolvedSx = resolveThemeInObject(sx);
  const resolvedStyles = resolveThemeInObject(styles);

  const mergedProps = {
    ...props,
    className,
    style: resolvedStyles,
    sx: resolvedSx,
  };

  const handleClick = data?.onClick
    ? (e: React.MouseEvent) => {
        try {
          if (typeof data.onClick === 'string') {
            const fn = new Function('event', data.onClick);
            fn(e);
          } else if (typeof data.onClick === 'function') {
            data.onClick(e);
          }
        } catch (error) {
          console.error('Error executing onClick:', error);
        }
      }
    : undefined;

  switch (type.toLowerCase()) {
    case 'animbox':
      return (
        <AnimBox {...mergedProps} animationObject={data?.animationObject} onClick={handleClick}>
          {children}
        </AnimBox>
      );

    case 'typography':
      return (
        <Typography {...mergedProps} variant={data?.variant || 'body1'}>
          {data?.text || children || ''}
        </Typography>
      );

    case 'button':
      return (
        <Button {...mergedProps} variant={data?.variant || 'contained'} onClick={handleClick}>
          {data?.text || children || 'Button'}
        </Button>
      );

    case 'box':
      const { component, animationObject, onClick, ...otherDataProps } = data || {};
      const boxProps = {
        ...mergedProps,
        component: component,
        ...otherDataProps, 
      };
      return <Box {...boxProps}>{children}</Box>;

    case 'stack':
      return (
        <Stack {...mergedProps} direction={data?.direction || 'column'} spacing={data?.spacing ?? 2}>
          {children}
        </Stack>
      );

    case 'paper':
      return <Paper {...mergedProps} elevation={data?.elevation ?? 1}>{children}</Paper>;

    case 'card':
      return <Card {...mergedProps}>{children}</Card>;

    case 'cardcontent':
      return <CardContent {...mergedProps}>{children}</CardContent>;

    case 'cardactions':
      return <CardActions {...mergedProps}>{children}</CardActions>;

    case 'textfield':
      return (
        <TextField
          {...mergedProps}
          label={data?.label || ''}
          placeholder={data?.placeholder || ''}
          variant={data?.variant || 'outlined'}
          type={data?.type || 'text'}
        />
      );

    case 'divider':
      return <Divider {...mergedProps} />;

    case 'iconbutton':
      return <IconButton {...mergedProps}>{data?.icon || children || ''}</IconButton>;

    case 'chip':
      return <Chip {...mergedProps} label={data?.label || ''} variant={data?.variant || 'filled'} />;

    case 'avatar':
      return <Avatar {...mergedProps} src={data?.src}>{data?.children || children || ''}</Avatar>;

    case 'alert':
      return <Alert {...mergedProps} severity={data?.severity || 'info'}>{data?.text || children || ''}</Alert>;

    default:
      console.warn(`Unknown element type: ${type}`);
      return (
        <Box {...mergedProps}>
          <Typography color="error">Unknown element type: {type}</Typography>
          {children}
        </Box>
      );
  }
};
