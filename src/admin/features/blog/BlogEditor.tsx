import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import Loader from '../../../shared/components/loader/Loader';
import Checkbox from '../../../shared/components/checkbox/Checkbox';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { updateDataInCollection } from '../../../services/database/updateData';
import { deleteDocument } from '../../../services/database/deleteData';

const BlogEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const postsFromStore = useAppSelector((state) => state.blog.blogPosts);
    const { loading, id } = useAppSelector((state) => state.loading);

    const [localPosts, setLocalPosts] = useState(postsFromStore);
    const [originalPosts, setOriginalPosts] = useState(postsFromStore);

    // Get unique categories from existing posts
    const categories = [...new Set(postsFromStore.map(post => post.postCategory).filter(Boolean))];

    const isLoading = (type: string, postId?: string) =>
        loading && id === `${type}${postId ? '-' + postId : ''}`;

    const hasChanges = JSON.stringify(localPosts.map(p => ({
        blogPostID: p.blogPostID,
        postTitle: p.postTitle,
        postCategory: p.postCategory,
        postSynopsis: p.postSynopsis,
    }))) !== JSON.stringify(originalPosts.map(p => ({
        blogPostID: p.blogPostID,
        postTitle: p.postTitle,
        postCategory: p.postCategory,
        postSynopsis: p.postSynopsis,
    })));

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

    const updatePostField = (id: string, field: keyof typeof localPosts[0], value: string | boolean) => {
        setLocalPosts(prev =>
            prev.map(post => post.blogPostID === id ? { ...post, [field]: value } : post)
        );
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

    useEffect(() => {
        const sorted = [...postsFromStore].sort((a, b) => a.postTitle.localeCompare(b.postTitle));
        setLocalPosts(sorted);
        setOriginalPosts(sorted);
    }, [postsFromStore]);

    const handleToggleActive = (postId: string, currentValue: boolean) => {
        handleDbAction(
            async () => {
                await updateDataInCollection('Blog', postId, { postActive: !currentValue });
                updatePostField(postId, 'postActive', !currentValue);
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
                    return localPost.postTitle !== original.postTitle ||
                        localPost.postCategory !== original.postCategory ||
                        localPost.postSynopsis !== original.postSynopsis;
                });
                await Promise.all(
                    changedPosts.map(post =>
                        updateDataInCollection('Blog', post.blogPostID, {
                            postTitle: post.postTitle,
                            postCategory: post.postCategory,
                            postSynopsis: post.postSynopsis,
                        })
                    )
                );
                setOriginalPosts(localPosts);
            },
            {
                loadingId: 'save-posts',
                successMsg: 'Post changes saved successfully.',
                errorMsg: 'Failed to save post changes.'
            }
        );
    };

    const handleDelete = (postId: string) => {
        handleDbAction(
            async () => {
                await deleteDocument('Blog', postId);
                setLocalPosts(prev => prev.filter(post => post.blogPostID !== postId));
                setOriginalPosts(prev => prev.filter(post => post.blogPostID !== postId));
            },
            {
                loadingId: `delete-${postId}`,
                successMsg: 'Post deleted successfully.',
                errorMsg: 'Failed to delete post.'
            }
        );
    };

    const handleCategoryChange = (postId: string, newCategory: string) => {
        updatePostField(postId, 'postCategory', newCategory);
    };

    return (
        <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col gap-4">
            {localPosts.map(post => (
                <Container key={post.blogPostID} TwClassName="flex-col border-gray-200 shadow border-1 rounded-xl p-4">
                    <Container TwClassName="rounded-md flex-row gap-4 items-center">
                        <Input
                            TwClassName="flex-grow"
                            label="Post Name"
                            value={post.postTitle}
                            onChange={(e) => updatePostField(post.blogPostID, 'postTitle', e.target.value)}
                        />
                        <Select
                            TwClassName="flex-grow"
                            label="Category"
                            value={post.postCategory}
                            onChange={(e) => handleCategoryChange(post.blogPostID, e.target.value)}
                            creatable={true}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Select>
                    </Container>
                    <Input
                        TwClassName="flex-grow mt-4"
                        label="Post Synopsis"
                        value={post.postSynopsis}
                        onChange={(e) => updatePostField(post.blogPostID, 'postSynopsis', e.target.value)}
                    />
                    <Container TwClassName="flex-row items-center gap-4 mt-4 ml-1">
                        <Button
                            onClick={() => clientNavigation(`/blog-post/${post.blogPostID}`, 'BlogPost', post?.blogPostID ?? '')()}
                            TwClassName="pt-0 pr-3 pb-0 pl-3 bg-primary rounded-xl text-white border border-primary hover:bg-transparent hover:text-primary"
                        >
                            View
                        </Button>
                        <Button TwClassName="pt-0 pr-3 pb-0 pl-3 bg-gray-200 rounded-xl text-black">
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(post.blogPostID)} TwClassName="pt-0 pr-3 pb-0 pl-3 bg-error rounded-xl text-white">
                            {isLoading('delete', post.blogPostID) ? <Loader variant='spinner' color="text-gray-100" /> : 'Delete'}
                        </Button>
                        <Checkbox 
                            checked={post.postActive} 
                            disabled={isLoading('toggle', post.blogPostID)}
                            onChange={() => handleToggleActive(post.blogPostID, post.postActive)}
                        />
                        {isLoading('toggle', post.blogPostID) && (
                            <Container TwClassName="flex items-center justify-center bg-white/50 rounded">
                                <Loader variant="spinner" color="text-amber-500" />
                            </Container>
                        )}
                        <Text text={post.postActive ? "Active" : "Inactive"} />
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
        </Container>
    );
};

export default BlogEditor;