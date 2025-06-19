import React from 'react';
import type { JSX } from 'react';
import Button from '../button/Button';
import Container from '../container/Container';
import Icon from '../Icon/Icon';
import { InputField } from '../InputField/InputField';
import Loader from '../loader/Loader';
import Menu from '../menu/Menu';
import Text from '../text/Text';
import Image from '../image/Image';
import Drawer from '../drawer/Drawer'; 
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDrawer } from '../drawer/drawerSlice';

const classReducer = (classes: { classDefinition: string }[] = []): string[] =>
  classes.map((c) => c.classDefinition);

const ComponentRenderer: React.FC<{ node: any }> = ({ node }) => {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((state) => state.drawer);

  const toggleDrawerByID = (id: string) => dispatch(toggleDrawer(id));

  const renderNode = (node: any): JSX.Element | null => {
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
      Drawer,
    };

    const Component = componentMap[type];
    if (!Component) {
      console.warn(`Unknown component type: ${type}`);
      return null;
    }

    if (type === 'Button' && props.actionID === 'toggleDrawer') {
      return (
        <Button
          {...clonedProps}
          action={() => toggleDrawerByID('navDrawer')}
          label={
            typeof props.label === 'object' ? renderNode(props.label) : props.label
          }
        />
      );
    }

    if (type === 'Drawer' && props.componentID === 'navDrawer') {
      return (
        <Drawer
          {...clonedProps}
          open={!!drawer['navDrawer']}
          onClose={() => toggleDrawerByID('navDrawer')}
        >
          {children.map((childNode: any, index: number) => (
            <React.Fragment key={index}>{renderNode(childNode)}</React.Fragment>
          ))}
        </Drawer>
      );
    }

    return (
      <Component {...clonedProps}>
        {children.map((childNode: any, index: number) => (
          <React.Fragment key={index}>{renderNode(childNode)}</React.Fragment>
        ))}
      </Component>
    );
  };

  return renderNode(node);
};

export default ComponentRenderer;
