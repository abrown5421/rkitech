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
import type { ElementMapperProps } from './elementsTypes';

export const ElementMapper: React.FC<ElementMapperProps> = ({ element, children }) => {
  if (!element || !element.type) {
    return (
      <Box>
        <Typography color="error">
          Invalid element: missing type
        </Typography>
      </Box>
    );
  }

  const { type, data = {}, styles, className, props } = element;

  const mergedProps = {
    ...props,
    style: styles,
    className: className,
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
    case 'typography':
      return (
        <Typography {...mergedProps} variant={data?.variant || 'body1'}>
          {data?.text || children || ''}
        </Typography>
      );

    case 'button':
      return (
        <Button 
          {...mergedProps}
          variant={data?.variant || 'contained'}
          onClick={handleClick}
        >
          {data?.text || children || 'Button'}
        </Button>
      );

    case 'box':
      return <Box {...mergedProps}>{children}</Box>;

    case 'stack':
      return (
        <Stack 
          {...mergedProps}
          direction={data?.direction || 'column'}
          spacing={data?.spacing ?? 2}
        >
          {children}
        </Stack>
      );

    case 'paper':
      return (
        <Paper 
          {...mergedProps}
          elevation={data?.elevation ?? 1}
        >
          {children}
        </Paper>
      );

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
      return (
        <IconButton {...mergedProps}>
          {data?.icon || children || ''}
        </IconButton>
      );

    case 'chip':
      return (
        <Chip
          {...mergedProps}
          label={data?.label || ''}
          variant={data?.variant || 'filled'}
        />
      );

    case 'avatar':
      return (
        <Avatar {...mergedProps} src={data?.src}>
          {data?.children || children || ''}
        </Avatar>
      );

    case 'alert':
      return (
        <Alert {...mergedProps} severity={data?.severity || 'info'}>
          {data?.text || children || ''}
        </Alert>
      );

    default:
      console.warn(`Unknown element type: ${type}`);
      return (
        <Box {...mergedProps}>
          <Typography color="error">
            Unknown element type: {type}
          </Typography>
          {children}
        </Box>
      );
  }
};