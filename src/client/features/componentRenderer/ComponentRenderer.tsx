import React from 'react';
import type { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleDrawer } from '../../../components/drawer/drawerSlice';
import Button from '../../../components/button/Button';
import Container from '../../../components/container/Container';
import Image from '../../../components/image/Image';
import Icon from '../../../components/Icon/Icon';
import { InputField } from '../../../components/InputField/InputField';
import Loader from '../../../components/loader/Loader';
import Menu from '../../../components/menu/Menu';
import Text from '../../../components/text/Text';
import Drawer from '../../../components/drawer/Drawer';

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
