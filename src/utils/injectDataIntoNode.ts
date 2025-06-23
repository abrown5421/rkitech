import type { JSONNode } from "../store/globalSlices/initialApp/initialAppTypes";

export function injectDataIntoNode(node: JSONNode, data: Record<string, any>): JSONNode {
  const clonedNode = structuredClone(node);

  const inject = (n: JSONNode): JSONNode => {
    if (typeof n !== 'object' || n === null) return n;

    const updatedProps = { ...n.props };

    Object.keys(updatedProps).forEach((key) => {
      if (typeof updatedProps[key] === 'string') {
        updatedProps[key] = interpolateString(updatedProps[key], data);
      }
    });

    return {
      ...n,
      props: updatedProps,
      children: n.children?.map(inject) ?? [],
    };
  };

  return inject(clonedNode);
}

function interpolateString(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const trimmedKey = key.trim();
    return data[trimmedKey] ?? '';
  });
}
