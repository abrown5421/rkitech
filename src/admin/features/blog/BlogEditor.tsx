import React, { useEffect } from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import { useGenericEditor } from '../../hooks/useGenericEditor';
import type { EditorAction, EditorField } from '../../components/genericEditor/GenericEditor';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import GenericEditor from '../../components/genericEditor/GenericEditor';
import { updateDataInCollection, updateTrianglifyAuxImage } from '../../../services/database/updateData';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { openModal } from '../../../shared/features/modal/modalSlice';
import type { BlogPost } from '../../../client/features/blog/blogTypes';

const BlogEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const postsFromStore = useAppSelector((state) => state.blog.blogPosts);
    const pages = useAppSelector((state) => state.pages.pages)
    const modalAction = useAppSelector((state) => state.modal.modalActionFire);
    const modalProps = useAppSelector(state => state.modal.modalProps);
    const RecordIdToUpdate = modalProps?.RecordIdToUpdate || '';
    const blogPage = pages.find((page) => page.componentKey === 'blogPostComp')
    
    const categories = [...new Set(postsFromStore.map(post => post.postCategory).filter(Boolean))];

    const editorConfig = {
        collectionName: 'Blog',
        itemIdField: 'blogPostID' as keyof BlogPost,
        sortField: 'postTitle' as keyof BlogPost,
        trackingFields: ['postTitle', 'postCategory', 'postSynopsis'] as (keyof BlogPost)[],
        postsPerPage: 10,
        deleteConfirmationTitle: 'Delete Blog Post?',
        deleteConfirmationMessage: (item: BlogPost) => 
            `Are you sure you want to delete the blog post "${item.postTitle}"? This action cannot be undone and will permanently remove the post and all its content.`,
    };

    
    useEffect(()=>{
        const runTrianglifyAction = async () => {
            if (modalAction.modalActionId === 'trianglifySave') {
            const trianglifyData = modalAction.trianglifyData; 
            
            if (typeof trianglifyData === 'string') {
                await updateTrianglifyAuxImage("Blog", RecordIdToUpdate, trianglifyData);
            } else {
                await updateDataInCollection("Blog", RecordIdToUpdate, {
                    trianglifyObject: trianglifyData,
                });
            }
            
    
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'success',
                alertMessage: 'Profile banner was uploaded successfully!',
                alertAnimation: {
                entranceAnimation: 'animate__fadeInRight animate__faster',
                exitAnimation: 'animate__fadeOutRight animate__faster',
                isEntering: true,
                }
            }));
    
            } else if (modalAction.modalActionId === 'trianglifyCancel') {
                console.log('User canceled trianglify modal');
            }
        };

        runTrianglifyAction();
    }, [modalAction]);

    
    const openTrianglifyModal = (post: BlogPost) => {
        dispatch(openModal({
                title: 'Customize Banner',
                modalType: 'trianglify',
                modalMessage: '',
                modalProps: {
                yColors: post.trianglifyObject.yColors,
                xColors: post.trianglifyObject?.xColors,
                cellSize: post.trianglifyObject?.cellSize,
                variance: post.trianglifyObject?.variance,
                width: post.trianglifyObject?.width,
                height: post.trianglifyObject?.height,
                auxImage: post.trianglifyObject.auxImage,
                existingImage: post.trianglifyObject.auxImage,
                RecordIdToUpdate: post.blogPostID,
                uploadDir: 'blogHeaders'
            }
        }));
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
    } = useGenericEditor(postsFromStore, editorConfig);

    const fields: EditorField[] = [
        {
            key: 'title-category',
            label: 'Title and Category',
            type: 'text',
            render: (item, updateField) => (
                <Container TwClassName="rounded-md flex-row gap-4 items-center">
                    <Input
                        TwClassName="flex-grow"
                        label="Post Name"
                        value={item.postTitle}
                        onChange={(e) => updateField('postTitle', e.target.value)}
                    />
                    <Select
                        TwClassName="flex-grow"
                        label="Category"
                        value={item.postCategory}
                        onChange={(e) => updateField('postCategory', e.target.value)}
                        creatable={true}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </Select>
                </Container>
            )
        },
        {
            key: 'postSynopsis',
            label: 'Post Synopsis',
            type: 'text',
            render: (item, updateField) => (
                <Container TwClassName="rounded-md flex-row gap-4 items-center">
                <Input
                    TwClassName="flex-grow"
                    label="Post Synopsis"
                    value={item.postSynopsis}
                    onChange={(e) => updateField('postSynopsis', e.target.value)}
                />
                <Input
                    TwClassName="flex-grow"
                    label="Header Image"
                    value={item.profileImage}
                    onClick={() => openTrianglifyModal(item)}
                    onChange={(e) => updateField('profileImage', e.target.value)}
                />
                </Container>
            )
        },
    ];

    const actions: EditorAction[] = [
        {
            label: 'View',
            className: "pt-0 pr-3 pb-0 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary",
            onClick: (item) => clientNavigation(`${blogPage?.pagePath.toLowerCase() ?? ''}/${item.blogPostID}`, 'BlogPost', item.blogPostID)(),
        },
        {
            label: 'Edit',
            className: "pt-0 pr-3 pb-0 pl-3 bg-gray-200 rounded-xl text-black",
            onClick: (item) => {
                console.log('Edit post:', item.blogPostID);
            },
        },
    ];

    const getChangedFields = (local: BlogPost, original: BlogPost) => {
        const changes: Partial<BlogPost> = {};
        if (local.postTitle !== original.postTitle) changes.postTitle = local.postTitle;
        if (local.postCategory !== original.postCategory) changes.postCategory = local.postCategory;
        if (local.postSynopsis !== original.postSynopsis) changes.postSynopsis = local.postSynopsis;
        return changes;
    };

    return (
        <GenericEditor
            title="Edit Blog Posts"
            items={paginatedItems}
            fields={fields}
            actions={actions}
            addButtonText="Add Post"
            addButtonModal={{
                title: 'New Blog Post',
                modalType: 'newBlogPost',
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
            getItemId={(item) => item.blogPostID}
            getItemActiveStatus={(item) => item.postActive}
        />
    );
};

export default BlogEditor;