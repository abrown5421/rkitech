import React from "react";
import Text from "../../components/text/Text";
import Container from "../../components/container/Container";
import Button from "../../components/button/Button"; 
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigationHook } from "../../../hooks/useNavigationHook";
import List from "../../components/list/List";
import { parseTwClassName } from "../../utils/parseTwClassName";
import { setActiveEditorComponent, setActiveEditorUUID } from "../../../admin/features/page/pageEditorSlice";
import type { PageEditorProps } from "../../../admin/features/page/pageEditorTypes";

const componentMap: Record<string, React.FC<any>> = {
  Text,
  Container,
  Button, 
  List
};

const PageContentRenderer = ({ content, cmsMode }: { content: any; cmsMode?: boolean }) => {
  const clientNavigation = useNavigationHook();
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.pages.pages);

  const handleNavigation = (componentKey: string) => {
    const targetPage = pages.find(page => page.componentKey === componentKey);
    if (targetPage) {
      dispatch(clientNavigation(targetPage.pagePath, targetPage.pageName, targetPage.pageID));
    } else {
      console.warn(`No page found with componentKey: ${componentKey}`);
    }
  };

  const processCmsClickHandler = (UUID: string, type: string) => {
    dispatch(setActiveEditorUUID(UUID));
    if (['Container','Text','Image','Icon','Button','List','TrianglifyBanner'].includes(type)) {
      dispatch(setActiveEditorComponent(type as PageEditorProps['activeEditorComponent']));
    }
  }

  const processOnClickHandler = (onClick: any) => {
    if (!onClick || typeof onClick !== 'object') {
      return onClick;
    }

    if (onClick.action === 'navigate' && onClick.args?.componentKey) {
      return () => handleNavigation(onClick.args.componentKey);
    }
    
    return onClick;
  };

  if (!content) return null;

  if (Array.isArray(content)) {
    return (
      <>
        {content.map((child, index) => (
          <PageContentRenderer key={index} content={child} cmsMode={cmsMode} />
        ))}
      </>
    );
  }

  const { type, props = {}, children: nodeChildren, UUID } = content;

  const Component = componentMap[type];
  if (!Component) {
    console.warn(`Component type "${type}" not found in componentMap`);
    return null;
  }

  const normalizedProps = { ...props };
  
  if (normalizedProps.TwClassName) {
    normalizedProps.TwClassName = parseTwClassName(normalizedProps.TwClassName);
  }

  if (normalizedProps.onClick) {
    normalizedProps.onClick = processOnClickHandler(normalizedProps.onClick);
  }

  if (UUID && type && cmsMode) {
    normalizedProps.onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      processCmsClickHandler(UUID, type);
    };
  }

  let renderedChildren = null;
  const childrenToRender = Array.isArray(props.children) 
    ? props.children 
    : Array.isArray(nodeChildren) 
    ? nodeChildren 
    : null;

  if (childrenToRender) {
    renderedChildren = childrenToRender.map((child: any, i: number) => (
      <PageContentRenderer key={i} content={child} cmsMode={cmsMode} />
    ));
  }

  return <Component {...normalizedProps}>{renderedChildren}</Component>;
};

export default PageContentRenderer;