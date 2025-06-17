import React from 'react';
import Container from '../../../components/container/Container';
import Text from '../../../components/text/Text';
import type { JSONNode } from '../../../store/globalSlices/initialApp/initialAppTypes';

interface PageRendererProps {
  node: JSONNode;
}

const classReducer = (classes: { classDefinition: string }[] = []): string[] =>
  classes.map((c) => c.classDefinition);

const PageRenderer: React.FC<PageRendererProps> = ({ node }) => {
  if (!node || typeof node !== 'object') return null;

  const { type, props = {}, children = [] } = node;

  const clonedProps = { ...props };

  if (clonedProps.twClasses && Array.isArray(clonedProps.twClasses)) {
    clonedProps.twClasses = classReducer(clonedProps.twClasses);
  }

  const componentMap: Record<string, React.ElementType> = {
    Container,
    Text,
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
