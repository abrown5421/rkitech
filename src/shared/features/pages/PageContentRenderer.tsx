import React from "react";
import Text from "../../components/text/Text";
import Container from "../../components/container/Container";

const componentMap: Record<string, React.FC<any>> = {
  Text,
  Container,
};

const PageContentRenderer = ({ content }: { content: any }) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return (
      <>
        {content.map((child, index) => (
          <PageContentRenderer key={index} content={child} />
        ))}
      </>
    );
  }

  const { type, props = {}, children: nodeChildren } = content;

  const Component = componentMap[type];
  if (!Component) {
    return null;
  }

  const normalizedProps = { ...props };

  let renderedChildren = null;
  const childrenToRender = Array.isArray(props.children) ? props.children : Array.isArray(nodeChildren) ? nodeChildren : null;

  if (childrenToRender) {
    renderedChildren = childrenToRender.map((child: any, i: number) => (
      <PageContentRenderer key={i} content={child} />
    ));
  }

  return <Component {...normalizedProps}>{renderedChildren}</Component>;
};

export default PageContentRenderer;
