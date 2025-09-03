import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import { useParams } from 'react-router-dom';
import { getDocumentById } from '../../../services/database/readData';
import { setLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { BlogPost as BlogPostType } from './blogTypes';
import Loader from '../../../shared/components/loader/Loader';
import TrianglifyBanner from '../../../shared/components/trianglifyBanner/TrianglifyBanner';
import Text from '../../../shared/components/text/Text';
import { format } from 'date-fns';
import PageContentRenderer from '../../../shared/features/pages/PageContentRenderer';

const BlogPost: React.FC = () => {
    const { blogPostIdFromUrl } = useParams();
    const dispatch = useAppDispatch();
    const { loading, id } = useAppSelector((state) => state.loading);
    const isBlogLoading = loading && id === 'profile';
    const [localPost, setLocalPost] = useState<BlogPostType>()

    useEffect(()=>{console.log(localPost)}, [localPost])

    useEffect(() => {
        const getBlogPost = async () => {
            if (!blogPostIdFromUrl) return;
            dispatch(setLoading({ loading: true, id: 'blogPost' }));
            try {
                const getPost = await getDocumentById<BlogPostType>('Blog', blogPostIdFromUrl);
                if (getPost) {
                    setLocalPost(getPost);
                }
            } catch (err) {
                console.error(err);
            } finally {
                dispatch(setLoading({ loading: false, id: 'blogPost' }));
            }
        };

        getBlogPost();
    }, [blogPostIdFromUrl]);
    
    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] w-full flex-col'>
            {!isBlogLoading && localPost ? (
                <Container TwClassName='flex-col relative'>
                    <Container TwClassName='absolute top-0 right-0 text-gray-900 bg-gray-200/80 pr-4 pl-4 pt-1 pb-1 m-5 rounded-full z-50'>
                        {localPost.postCategory}
                    </Container>
                    <TrianglifyBanner
                        xColors={localPost.trianglifyObject.xColors}
                        yColors={localPost.trianglifyObject.yColors}
                        width="w-full"
                        height={250}
                        variance={localPost.trianglifyObject.variance}
                        cellSize={localPost.trianglifyObject.cellSize}
                        auxImage={localPost.trianglifyObject.auxImage}
                    />
                    <Container TwClassName='flex-col p-10 w-full md:w-4/5 lg:w-1/2 mx-auto'>
                        <Text text={localPost.postTitle} TwClassName='text-gray-900 font-primary text-4xl mb-5' />
                        <PageContentRenderer content={localPost.content} cmsMode={false} />
                        <Container TwClassName="flex-row justify-between border-t border-gray-200 pt-2 mt-4">
                            <Text text={localPost.postAuthor} TwClassName="text-amber-500 text-xs" />
                            <Text
                                text={format(new Date(localPost.postDate), 'EEEE, MMMM do, yyyy')}
                                TwClassName="text-gray-500 text-xs"
                            />
                        </Container>
                    </Container>
                </Container>
            ) : (
                <Container TwClassName='flex-col w-full h-full justify-center items-center'>
                    <Loader variant='spinner' color='text-amber-500' />
                </Container>
            )}
        </Container>
    );
};
export default BlogPost;
