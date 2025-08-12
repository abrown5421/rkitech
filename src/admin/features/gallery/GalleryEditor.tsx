import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import Icon from '../../../shared/components/icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Input from '../../../shared/components/input/Input';
import Pagination from '../../../shared/components/pagination/Pagination';
import Image from '../../../shared/components/image/Image';
import { openModal } from '../../../shared/features/modal/modalSlice';
import type { GalleryImage } from '../../../client/features/gallery/galleryTypes';
import Loader from '../../../shared/components/loader/Loader';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import { updateDataInCollection } from '../../../services/database/updateData';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { deleteDocument } from '../../../services/database/deleteData';

const GalleryEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const gallery = useAppSelector((state) => state.gallery.gallery);
    const { loading, id } = useAppSelector((state) => state.loading);
    
    const [localPosts, setLocalPosts] = useState(gallery);
    const [originalPosts, setOriginalPosts] = useState(gallery);
    const [currentPage, setCurrentPage] = useState(0);

    const postsPerPage = 5;
    const totalPages = Math.ceil(gallery.length / postsPerPage);

    const paginatedGallery = localPosts.slice(
        currentPage * postsPerPage,
        currentPage * postsPerPage + postsPerPage
    );

    const isLoading = (type: string, postId?: string) =>
        loading && id === `${type}${postId ? '-' + postId : ''}`;

    const hasChanges = JSON.stringify(localPosts.map(p => ({
        galleryPostID: p.galleryPostID,
        imageName: p.imageName,
        imageDescription: p.imageDescription,
        imageUrl: p.imageUrl,
    }))) !== JSON.stringify(originalPosts.map(p => ({
        galleryPostID: p.galleryPostID,
        imageName: p.imageName,
        imageDescription: p.imageDescription,
        imageUrl: p.imageUrl,
    })));

    useEffect(() => {
        const sorted = [...gallery].sort((a, b) => a.imageName.localeCompare(b.imageName));
        setLocalPosts(sorted);
        setOriginalPosts(sorted);
    }, [gallery]);

    const updatePostField = (id: string, field: keyof typeof localPosts[0], value: string | boolean) => {
        setLocalPosts(prev =>
            prev.map(post => post.galleryPostID === id ? { ...post, [field]: value } : post)
        );
    };

    const handleUploadModal = (post: GalleryImage) => {
        dispatch(
            openModal({
            title: 'Change Gallery Image',
            modalType: 'imageUploadModal',
            modalProps: post 
            })
        );
    };

    const handleNewImageModal = () => {
        dispatch(
            openModal({
            title: 'New Gallery Image',
            modalType: 'newImageModal',
            })
        );
    };
    
    const showAlert = (severity: 'success' | 'error', message: string) => {
        dispatch(openAlert({
            alertOpen: true,
            alertSeverity: severity,
            alertMessage: message,
            alertAnimation: {
                entranceAnimation: 'animate__fadeInRight animate__faster',
                exitAnimation: 'animate__fadeOutRight animate__faster',
                isEntering: true,
            }
        }));
    };

    const handleDbAction = async (
        action: () => Promise<void>,
        { loadingId, successMsg, errorMsg }: { loadingId: string, successMsg: string, errorMsg: string }
    ) => {
        dispatch(setLoading({ loading: true, id: loadingId }));
        try {
            await action();
            showAlert('success', successMsg);
        } catch (error) {
            console.error(error);
            showAlert('error', errorMsg);
        } finally {
            dispatch(setNotLoading());
        }
    };
    
    const handleToggleActive = (postId: string, currentValue: boolean) => {
        handleDbAction(
            async () => {
                await updateDataInCollection('Gallery', postId, { imageActive: !currentValue });
                updatePostField(postId, 'imageActive', !currentValue);
            },
            {
                loadingId: `toggle-${postId}`,
                successMsg: `Post marked as ${!currentValue ? 'Active' : 'Inactive'}.`,
                errorMsg: 'Failed to update active state.'
            }
        );
    };

    const handleSave = () => {
        handleDbAction(
            async () => {
                const changedPosts = localPosts.filter((localPost, i) => {
                    const original = originalPosts[i];
                    return (
                    localPost.imageName !== original.imageName ||
                    localPost.imageDescription !== original.imageDescription ||
                    localPost.imageUrl !== original.imageUrl
                    );
                });

                await Promise.all(
                    changedPosts.map(post =>
                    updateDataInCollection('Gallery', post.galleryPostID, {
                        imageName: post.imageName,
                        imageDescription: post.imageDescription,
                        imageUrl: post.imageUrl,
                    })
                    )
                );

                setOriginalPosts(localPosts);
            },
            {
                loadingId: 'save-posts',
                successMsg: 'Gallery posts saved successfully.',
                errorMsg: 'Failed to save gallery posts.',
            }
        );
    };

    const handleDelete = (postId: string) => {
        handleDbAction(
            async () => {
                await deleteDocument('Gallery', postId);
                setLocalPosts(prev => prev.filter(post => post.galleryPostID !== postId));
                setOriginalPosts(prev => prev.filter(post => post.galleryPostID !== postId));
            },
            {
                loadingId: `delete-${postId}`,
                successMsg: 'Post deleted successfully.',
                errorMsg: 'Failed to delete post.'
            }
        );
    };

    return (
        <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col gap-4">
            <Container TwClassName='flex-row justify-between'>
                <Container TwClassName='flex-col flex-10'>
                    <Text text="Edit Gallery Posts" TwClassName='text-black font-primary text-xl' />
                </Container>
                <Container TwClassName='flex-col flex-2 h-full justify-center'>
                    <Button
                        onClick={handleNewImageModal}
                        TwClassName="relative pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white border border-primary hover:text-primary hover:bg-transparent flex justify-center items-center"
                    >
                        <span className="absolute left-3">
                            <Icon color="text-gray-100" name="Plus" />
                        </span>
                        Add Post
                    </Button>
                </Container>
            </Container>
            
            {paginatedGallery.map(post => (
                <Container key={post.galleryPostID} TwClassName="flex-row border-gray-200 shadow border-1 rounded-xl gap-4 p-4">
                    <Container TwClassName='flex-col'>
                        <Image 
                            src={post.imageUrl}
                            alt={post.imageDescription}
                            TwClassName='w-[150px] h-[150px] object-cover object-center rounded-md'
                        />
                    </Container>
                    <Container TwClassName='flex-col flex-grow'>
                        <Container TwClassName="rounded-md flex-row gap-4 items-center">
                            <Input
                                TwClassName="flex-grow"
                                label="Post Name"
                                value={post.imageName}
                                onChange={(e) => updatePostField(post.galleryPostID, 'imageName', e.target.value)}
                            />
                            <Input
                                TwClassName="flex-grow"
                                label="Post Source"
                                value={post.imageUrl}
                                onClick={() => handleUploadModal(post)}
                            />
                        </Container>
                        <Input
                            TwClassName="flex-grow mt-4"
                            label="Post Description"
                            value={post.imageDescription}
                            onChange={(e) => updatePostField(post.galleryPostID, 'imageDescription', e.target.value)}
                        />
                        <Container TwClassName='flex-row items-center gap-2'>
                            <Button onClick={() => handleDelete(post.galleryPostID)} TwClassName="pt-0 pr-3 pb-0 pl-3 bg-error rounded-xl text-white">
                                {isLoading('delete', post.galleryPostID) ? <Loader variant='spinner' color="text-gray-100" /> : 'Delete'}
                            </Button>
                            <Checkbox 
                                checked={post.imageActive} 
                                disabled={isLoading('toggle', post.galleryPostID)}
                                onChange={() => handleToggleActive(post.galleryPostID, post.imageActive)}
                            />
                            {isLoading('toggle', post.galleryPostID) && (
                                <Container TwClassName="flex items-center justify-center bg-white/50 rounded">
                                    <Loader variant="spinner" color="text-amber-500" />
                                </Container>
                            )}
                            <Text text={post.imageActive ? "Active" : "Inactive"} />
                        </Container>
                    </Container>
                </Container>
            ))}
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
                    <Button onClick={() => setLocalPosts(originalPosts)} TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-gray-200 rounded-xl text-black">
                        Undo
                    </Button>
                    <Button onClick={handleSave} TwClassName="mb-3 pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white">
                        {isLoading('save-posts') ? <Loader variant="spinner" color="amber-500" /> : 'Save'}
                    </Button>
                </Container>
            )}
            {totalPages >= 1 && <div className='pb-4' />}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                TwClassName='pb-4'
            />
        </Container>
    );
};
export default GalleryEditor;
