import React, { useEffect, useState } from 'react';
import type { CollectionLooperProps } from './collectionLooperTypes';
import { getDocumentByCondition, getEntireCollection } from '../../../services/database/readData';
import ComponentRenderer from '../componentRenderer/ComponentRenderer';
import { injectDataIntoNode } from '../../../utils/injectDataIntoNode';


const CollectionLooper: React.FC<CollectionLooperProps> = ({
  collectionName,
  itemRendererNode,
  filter
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const data = filter
        ? await getDocumentByCondition(collectionName, filter.field, filter.value)
        : await getEntireCollection(collectionName);

      const sorted = [...(data ?? [])].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : Infinity;
        const orderB = typeof b.order === 'number' ? b.order : Infinity;
        return orderA - orderB;
      });

      setItems(sorted);
      setLoading(false);
    };

    fetchItems();
  }, [collectionName, JSON.stringify(filter)]);

  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>No items found.</div>;

  return (
    <>
      {items.map((item, index) => {
        const injectedNode = injectDataIntoNode(itemRendererNode, item);
        return <ComponentRenderer key={index} node={injectedNode} />;
      })}
    </>
  );
};

export default CollectionLooper;
