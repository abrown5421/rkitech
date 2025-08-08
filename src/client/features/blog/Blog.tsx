import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import { useAppSelector } from '../../../app/hooks';
import TrianglifyBanner from '../../../shared/components/trianglifyBanner/TrianglifyBanner';
import { format } from 'date-fns';
import Pagination from '../../../shared/components/pagination/Pagination';

const Blog: React.FC = () => {
    const blogPosts = useAppSelector((state) => state.blog.blogPosts);
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 12;
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);
    const paginatedPosts = blogPosts.slice(
        currentPage * postsPerPage,
        currentPage * postsPerPage + postsPerPage
    );

    useEffect(() => {
        if (currentPage >= totalPages) {
        setCurrentPage(0);
        }
    }, [blogPosts, currentPage, totalPages]);

    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col'>
            <Container TwClassName='flex-row justify-between flex-wrap'>
                {paginatedPosts.map((post) => (
                    <Container
                        key={post.postTitle}
                        TwClassName="flex flex-col relative border border-gray-200 shadow rounded w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.5rem)]"
                    >
                        <Container TwClassName='absolute top-0 right-0 text-black bg-gray-200/80 pr-4 pl-4 pt-1 pb-1 m-2 rounded-full z-50'>
                            {post.postCategory}
                        </Container>
                        <TrianglifyBanner
                            xColors={post.trianglifyObject.xColors}
                            yColors={post.trianglifyObject.yColors}
                            width="w-full"
                            height={post.trianglifyObject.height}
                            variance={post.trianglifyObject.variance}
                            cellSize={post.trianglifyObject.cellSize}
                            auxImage={post.trianglifyObject.auxImage}
                        />
                        <Container TwClassName="flex flex-col flex-grow p-4 justify-between">
                            <Container TwClassName="flex flex-col flex-grow">
                                <Text text={post.postTitle} TwClassName="text-xl font-primary text-black mb-4" />
                                <Text text={post.postSynopsis} />
                            </Container>
                            

                            <Container TwClassName="flex-row justify-between border-t border-gray-200 pt-2 mt-4">
                                <Text text={post.postAuthor} TwClassName="text-primary text-xs" />
                                <Text
                                    text={format(new Date(post.postDate), 'EEEE, MMMM do, yyyy')}
                                    TwClassName="text-gray-500 text-xs"
                                />
                            </Container>
                        </Container>
                    </Container>
                ))}
            </Container>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                className="mt-8"
            />
        </Container>
    );
};
export default Blog;
