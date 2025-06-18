import React from 'react';
import type { ComponentRendererProps } from './componentRendererTypes';
import Button from '../button/Button';
import Container from '../container/Container';
import Icon from '../Icon/Icon';
import { InputField } from '../InputField/InputField';
import Loader from '../loader/Loader';
import Menu from '../menu/Menu';
import Text from '../text/Text';
import Image from '../image/Image';


const classReducer = (classes: { classDefinition: string }[] = []): string[] =>
  classes.map((c) => c.classDefinition);

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ node }) => {
  if (!node || typeof node !== 'object') return null;

  const { type, props = {}, children = [] } = node;

  const clonedProps = { ...props };

  if (clonedProps.twClasses && Array.isArray(clonedProps.twClasses)) {
    clonedProps.twClasses = classReducer(clonedProps.twClasses);
  }

  if (clonedProps.secondaryClasses && Array.isArray(clonedProps.secondaryClasses)) {
    clonedProps.secondaryClasses = classReducer(clonedProps.secondaryClasses);
  }

  const componentMap: Record<string, React.ElementType> = {
    Button,
    Container,
    Image,
    Icon,
    InputField,
    Loader,
    Menu,
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
        <ComponentRenderer key={index} node={childNode} />
      ))}
    </Component>
  );
};

export default ComponentRenderer;
