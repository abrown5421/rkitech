export const findNodeByUUID = (node: any, UUID: string): any | null => {
    if (!node) return null;
    if (node.UUID === UUID) return node;
    const children = node.children || node.props?.children || [];
    for (const child of children) {
      const result = findNodeByUUID(child, UUID);
      if (result) return result;
    }
    return null;
  };