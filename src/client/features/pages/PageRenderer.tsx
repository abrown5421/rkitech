import React from 'react';
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

const PageRenderer: React.FC<PageRendererProps> = ({ node }) => {
  const useClientNavigation = useClientNavigationHook(); 

  if (!node || typeof node !== 'object') return null;

  const { type, props = {}, children = [] } = node;

  const clonedProps = { ...props };

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

  const Component = componentMap[type];

  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  return (
    <Component {...clonedProps}>
      {children.map((childNode, index) => (
        <PageRenderer key={index} node={childNode} />
      ))}
    </Component>
  );
};

export default PageRenderer;
