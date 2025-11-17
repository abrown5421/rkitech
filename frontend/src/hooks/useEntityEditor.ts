import { useState, useEffect } from 'react';

interface UseEntityEditorProps<T> {
  defaultEntity: Partial<T>;
  currentEntity?: T;
  isNew: boolean;
}

export const useEntityEditor = <T extends Record<string, any>>({
  defaultEntity,
  currentEntity,
  isNew,
}: UseEntityEditorProps<T>) => {
  const [editableEntity, setEditableEntity] = useState<T | undefined>(currentEntity);
  const [newEntity, setNewEntity] = useState<Partial<T>>(defaultEntity);

  useEffect(() => {
    if (currentEntity) {
      setEditableEntity(currentEntity);
    }
  }, [currentEntity]);

  const entity = isNew ? newEntity : editableEntity;
  const originalEntity = isNew ? defaultEntity : currentEntity;
  
  const isChanged = JSON.stringify(entity) !== JSON.stringify(originalEntity);

  const handleChange = (updates: Partial<T>) => {
    if (isNew) {
      setNewEntity({ ...newEntity, ...updates });
    } else {
      setEditableEntity({ ...editableEntity!, ...updates });
    }
  };

  const handleRevert = () => {
    if (!isNew && currentEntity) {
      setEditableEntity(currentEntity);
    }
  };

  return {
    entity,
    originalEntity,
    isChanged,
    handleChange,
    handleRevert,
  };
};