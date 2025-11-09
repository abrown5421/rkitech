import React from 'react';
import { useGetElementsByIdQuery } from '../../features/elements/elementsApi';
import { Box, CircularProgress, Alert } from '@mui/material';
import type { ElementNodeProps, ElementRendererProps, ElementWithChildrenProps } from './elementsTypes';
import { ElementMapper } from './ElementMapper';

export const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  elementIds, 
  full,
  onError 
}) => {
  return (
    <Box sx={{height: full ? '100%' : ''}}>
      {elementIds.map((elementId) => (
        <ElementNode key={elementId} elementId={elementId} onError={onError} />
      ))}
    </Box>
  );
};

const ElementNode: React.FC<ElementNodeProps> = ({ elementId, onError }) => {
  const { data, isLoading, error } = useGetElementsByIdQuery(elementId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (error) {
    onError?.(error);
    return (
      <Alert severity="error" sx={{ my: 1 }}>
        Failed to load element: {elementId}
      </Alert>
    );
  }

if (!data) return null;

const element = Array.isArray(data) ? data[0] : data;

if (!element) return null;

  return <ElementWithChildren element={element} onError={onError} />;
};

const ElementWithChildren: React.FC<ElementWithChildrenProps> = ({ 
  element, 
  onError 
}) => {
  if (!element.children || element.children.length === 0) {
    return <ElementMapper element={element} />;
  }

  const childElements = element.children.map((childId) => (
    <ElementNode key={childId} elementId={childId} onError={onError} />
  ));

  return <ElementMapper element={element} children={childElements} />;
};