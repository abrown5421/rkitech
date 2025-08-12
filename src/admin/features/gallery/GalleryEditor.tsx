import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { GalleryImage } from '../../../client/features/gallery/galleryTypes';
import { useGenericEditor } from '../../hooks/useGenericEditor';
import { openModal } from '../../../shared/features/modal/modalSlice';
import type { EditorField } from '../../components/genericEditor/GenericEditor';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Image from '../../../shared/components/image/Image';
import GenericEditor from '../../components/genericEditor/GenericEditor';

const GalleryEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const gallery = useAppSelector((state) => state.gallery.gallery);
    
    const editorConfig = {
        collectionName: 'Gallery',
        itemIdField: 'galleryPostID' as keyof GalleryImage,
        sortField: 'imageName' as keyof GalleryImage,
        trackingFields: ['imageName', 'imageDescription', 'imageUrl'] as (keyof GalleryImage)[],
        postsPerPage: 5,
    };

    const {
        paginatedItems,
        currentPage,
        totalPages,
        hasChanges,
        isLoading,
        updateItemField,
        handleToggleActive,
        handleSave,
        handleDelete,
        resetChanges,
        setCurrentPage,
    } = useGenericEditor(gallery, editorConfig);

    const handleUploadModal = (post: GalleryImage) => {
        dispatch(
            openModal({
                title: 'Change Gallery Image',
                modalType: 'imageUploadModal',
                modalProps: post 
            })
        );
    };

    const fields: EditorField[] = [
        {
            key: 'imageName',
            label: 'Post Name',
            type: 'text',
            render: (item, updateField) => (
                <Container TwClassName="rounded-md flex-row gap-4 items-center">
                    <Input
                        TwClassName="flex-grow"
                        label="Post Name"
                        value={item.imageName}
                        onChange={(e) => updateField('imageName', e.target.value)}
                    />
                    <Input
                        TwClassName="flex-grow"
                        label="Post Source"
                        value={item.imageUrl}
                        onClick={() => handleUploadModal(item)}
                    />
                </Container>
            )
        },
        {
            key: 'imageDescription',
            label: 'Post Description',
            type: 'text',
            render: (item, updateField) => (
                <Input
                    TwClassName="flex-grow mt-4"
                    label="Post Description"
                    value={item.imageDescription}
                    onChange={(e) => updateField('imageDescription', e.target.value)}
                />
            )
        },
    ];

    const getChangedFields = (local: GalleryImage, original: GalleryImage) => {
        const changes: Partial<GalleryImage> = {};
        if (local.imageName !== original.imageName) changes.imageName = local.imageName;
        if (local.imageDescription !== original.imageDescription) changes.imageDescription = local.imageDescription;
        if (local.imageUrl !== original.imageUrl) changes.imageUrl = local.imageUrl;
        return changes;
    };

    const renderCustomContent = (item: GalleryImage) => (
        <Container TwClassName='flex-row gap-4 mb-4'>
            <Container TwClassName='flex-col'>
                <Image 
                    src={item.imageUrl}
                    alt={item.imageDescription}
                    TwClassName='w-[200px] h-[200px] object-cover object-center rounded-md'
                />
            </Container>
            <Container TwClassName='flex-col flex-grow'>
                &nbsp;
            </Container>
        </Container>
    );

    return (
        <GenericEditor
            title="Edit Gallery Posts"
            items={paginatedItems}
            fields={fields}
            addButtonText="Add Post"
            addButtonModal={{
                title: 'New Gallery Image',
                modalType: 'newImageModal',
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            hasChanges={hasChanges}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onFieldUpdate={updateItemField}
            onSave={() => handleSave(getChangedFields)}
            onReset={resetChanges}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            getItemId={(item) => item.galleryPostID}
            getItemActiveStatus={(item) => item.imageActive}
            renderCustomContent={renderCustomContent}
        />
    );
};

export default GalleryEditor;