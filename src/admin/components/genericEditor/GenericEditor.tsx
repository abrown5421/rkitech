import React from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import Icon from '../../../shared/components/icon/Icon';
import Loader from '../../../shared/components/loader/Loader';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import Pagination from '../../../shared/components/pagination/Pagination';
import { useAppDispatch } from '../../../app/hooks';
import { openModal } from '../../../shared/features/modal/modalSlice';

export interface EditorField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'image' | 'readonly';
  component?: React.ComponentType<any>;
  props?: any;
  render?: (item: any, updateField: (key: string, value: any) => void) => React.ReactNode;
}

export interface EditorAction {
  label: string;
  className: string;
  onClick: (item: any) => void;
  isLoading?: (item: any) => boolean;
  show?: (item: any) => boolean;
}

interface GenericEditorProps<T> {
  title: string;
  items: T[];
  fields: EditorField[];
  actions?: EditorAction[];
  addButtonText?: string;
  addButtonModal?: {
    title: string;
    modalType: string;
    modalProps?: any;
  };
  currentPage: number;
  totalPages: number;
  hasChanges: boolean;
  isLoading: (type: string, id?: string) => boolean;
  onPageChange: (page: number) => void;
  onFieldUpdate: (itemId: string, field: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  onToggleActive?: (itemId: string, currentValue: boolean) => void;
  onDelete?: (itemId: string) => void;
  getItemId: (item: T) => string;
  getItemActiveStatus?: (item: T) => boolean;
  renderCustomContent?: (item: T) => React.ReactNode;
  customContainer?: string;
}

function GenericEditor<T extends Record<string, any>>({
  title,
  items,
  fields,
  actions = [],
  addButtonText = "Add Item",
  addButtonModal,
  currentPage,
  totalPages,
  hasChanges,
  isLoading,
  onPageChange,
  onFieldUpdate,
  onSave,
  onReset,
  onToggleActive,
  onDelete,
  getItemId,
  getItemActiveStatus,
  renderCustomContent,
}: GenericEditorProps<T>) {
  const dispatch = useAppDispatch();

  const handleAddNew = () => {
    if (addButtonModal) {
      dispatch(
        openModal({
          title: addButtonModal.title,
          modalType: addButtonModal.modalType,
          modalProps: addButtonModal.modalProps,
        })
      );
    }
  };

  const renderField = (item: T, field: EditorField) => {
    const itemId = getItemId(item);
    const value = item[field.key];
    
    if (field.render) {
      return field.render(item, (key, val) => onFieldUpdate(itemId, key, val));
    }

    if (field.component) {
      const Component = field.component;
      return (
        <Component
          {...field.props}
          value={value}
          onChange={(e: any) => onFieldUpdate(itemId, field.key, e.target ? e.target.value : e)}
        />
      );
    }

    return null;
  };

  const defaultActions: EditorAction[] = [];

  if (onDelete) {
    defaultActions.push({
      label: 'Delete',
      className: "pt-0 pr-3 pb-0 pl-3 bg-error rounded-xl text-gray-50",
      onClick: (item) => onDelete(getItemId(item)),
      isLoading: (item) => isLoading('delete', getItemId(item)),
    });
  }

  const allActions = [...actions, ...defaultActions];

  return (
    <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col flex-grow gap-4">
      <Container TwClassName='flex-row justify-between'>
        <Container TwClassName='flex-col flex-10'>
          <Text text={title} TwClassName='text-gray-900 font-primary text-xl' />
        </Container>
        {addButtonModal && (
          <Container TwClassName='flex-col flex-2 h-full justify-center'>
            <Button
              onClick={handleAddNew}
              TwClassName="relative pt-1 pr-3 pb-1 pl-3 bg-amber-500 rounded-xl text-gray-50 border border-primary hover:text-amber-500 hover:bg-transparent flex justify-center items-center"
            >
              <span className="absolute left-3">
                <Icon color="text-gray-100" name="Plus" />
              </span>
              {addButtonText}
            </Button>
          </Container>
        )}
      </Container>
      
      {items.map(item => {
        const itemId = getItemId(item);
        const isActive = getItemActiveStatus?.(item);
        
        return (
          <Container key={itemId} TwClassName="flex-col border-gray-200 shadow border-1 rounded-xl p-4">
            <Container TwClassName='flex-row'>
                <Container TwClassName='flex-col'>
                    {renderCustomContent?.(item)}
                </Container>
                <Container TwClassName="flex-col gap-4 flex-grow">
                {fields.map((field) => (
                    <div key={field.key} className={field.props?.containerClassName || ""}>
                    {renderField(item, field)}
                    </div>
                ))}
            
                <Container TwClassName="flex-row items-center gap-4 mt-4">
                {allActions.map((action, index) => {
                    if (action.show && !action.show(item)) return null;
                    
                    const actionIsLoading = action.isLoading?.(item) || false;
                    
                    return (
                    <Button 
                        key={index}
                        onClick={() => action.onClick(item)} 
                        TwClassName={action.className}
                        disabled={actionIsLoading}
                    >
                        {actionIsLoading ? (
                        <Loader variant='spinner' color="text-gray-100" />
                        ) : (
                        action.label
                        )}
                    </Button>
                    );
                })}
                
                {onToggleActive && getItemActiveStatus && (
                    <>
                    <Checkbox 
                        checked={isActive || false}
                        disabled={isLoading('toggle', itemId)}
                        onChange={() => onToggleActive(itemId, isActive || false)}
                    />
                    {isLoading('toggle', itemId) && (
                        <Container TwClassName="flex items-center justify-center bg-gray-50/50 rounded">
                        <Loader variant="spinner" color="text-amber-500" />
                        </Container>
                    )}
                    <Text text={isActive ? "Active" : "Inactive"} />
                    </>
                )}
                </Container>
                </Container>
            </Container>
          </Container>
        );
      })}
      
      {hasChanges && (
        <Container
          animation={{
            entranceExit: {
              entranceAnimation: 'animate__fadeIn animate__faster',
              exitAnimation: 'animate__fadeOut animate__faster',
              isEntering: hasChanges,
            }
          }}
          TwClassName="flex-row gap-2 justify-center"
        >
          <Button 
            onClick={onReset} 
            TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-gray-900"
          >
            Undo
          </Button>
          <Button 
            onClick={onSave} 
            TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-amber-500 rounded-xl text-gray-50"
          >
            {isLoading('save-items') ? (
              <Loader variant="spinner" color="amber-500" />
            ) : (
              'Save'
            )}
          </Button>
        </Container>
      )}
      
      {totalPages > 1 && <div className='pb-4' />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        TwClassName='pb-4'
      />
    </Container>
  );
}

export default GenericEditor;