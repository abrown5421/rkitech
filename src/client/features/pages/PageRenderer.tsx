import React, { useState } from 'react';
import Container from '../../../components/container/Container';
import Text from '../../../components/text/Text';
import Button from '../../../components/button/Button';
import Icon from '../../../components/Icon/Icon';
import { InputField } from '../../../components/InputField/InputField';
import Loader from '../../../components/loader/Loader';
import Menu from '../../../components/menu/Menu';
import type { PageRendererProps } from './PageRendererTypes';
import Form from '../../../components/form/Form';
import CollectionLooper from '../collectionLooper/CollectionLooper';
import { useClientNavigationHook } from '../../hooks/useClientNavigationHook';

const classReducer = (classes: { classDefinition: string }[] = []): string[] =>
  classes.map((c) => c.classDefinition);

const componentMap: Record<string, React.ElementType> = {
  Button,
  Container,
  Icon,
  InputField,
  Loader,
  Menu,
  Text,
  Form,
  CollectionLooper
};

const PageRendererInternal: React.FC<
  PageRendererProps & {
    hoveredUUID: string | null;
    setHoveredUUID: (uuid: string | null) => void;
  }
> = ({ node, editing, hoveredUUID, setHoveredUUID }) => {
  const useClientNavigation = useClientNavigationHook();

  if (!node || typeof node !== 'object') return null;

  const { type, props = {}, children = [] } = node;
  const clonedProps = { ...props };
  const uuid = node.UUID;

  if (clonedProps.twClasses && Array.isArray(clonedProps.twClasses)) {
    clonedProps.twClasses = classReducer(clonedProps.twClasses);
  }

  if (
    type === 'Button' &&
    clonedProps.navigateTo &&
    clonedProps.pageName &&
    clonedProps.pageID
  ) {
    clonedProps.onClick = useClientNavigation(
      clonedProps.navigateTo,
      clonedProps.pageName,
      clonedProps.pageID
    );
  }

  if (editing) {
    const editClasses = [
      'border-2',
      'border-dashed',
      hoveredUUID === uuid ? 'border-amber-500' : 'border-gray-300',
      hoveredUUID === uuid ? 'border-solid' : ''
    ];

    clonedProps.twClasses = [...(clonedProps.twClasses || []), ...editClasses];
    clonedProps.onMouseOver = (e: React.MouseEvent) => {
      if (e.currentTarget === e.target) {
        setHoveredUUID(uuid);
      }
    };

    clonedProps.onMouseOut = (e: React.MouseEvent) => {
      if (e.currentTarget === e.target) {
        setHoveredUUID(null);
      }
    };
  }

  const Component = componentMap[type];
  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  return (
    <Component {...clonedProps}>
      {children.map((childNode: any, index: number) => (
        <PageRendererInternal
          key={index}
          node={childNode}
          editing={editing}
          hoveredUUID={hoveredUUID}
          setHoveredUUID={setHoveredUUID}
        />
      ))}
    </Component>
  );
};

const PageRenderer: React.FC<PageRendererProps> = ({ node, editing }) => {
  const [hoveredUUID, setHoveredUUID] = useState<string | null>(null);

  return (
    <PageRendererInternal
      node={node}
      editing={editing}
      hoveredUUID={hoveredUUID}
      setHoveredUUID={setHoveredUUID}
    />
  );
};

export default PageRenderer;
