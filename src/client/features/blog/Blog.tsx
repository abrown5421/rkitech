import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import { useAppSelector } from '../../../app/hooks';
import TrianglifyBanner from '../../../shared/components/trianglifyBanner/TrianglifyBanner';
import { format } from 'date-fns';
import Pagination from '../../../shared/components/pagination/Pagination';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Button from '../../../shared/components/button/Button';
import Select from '../../../shared/components/select/Select';

const Blog: React.FC = () => {
    const clientNavigation = useNavigationHook();
    const blogPosts = useAppSelector((state) => state.blog.blogPosts);
    const pages = useAppSelector((state) => state.pages.pages);
    const blogPage = pages.find((page) => page.componentKey === 'blogPostComp')
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const categories = ['All Posts', ...Array.from(new Set(blogPosts.map(post => post.postCategory)))];
    const activePosts = blogPosts.filter(post => post.postActive);

    const filteredPosts = selectedCategory === 'All Posts' 
        ? activePosts
        : activePosts.filter(post => post.postCategory === selectedCategory);

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const dateA = new Date(a.postDate).getTime();
        const dateB = new Date(b.postDate).getTime();

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const postsPerPage = 9;
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
    
    const paginatedPosts = sortedPosts.slice(
        currentPage * postsPerPage,
        currentPage * postsPerPage + postsPerPage
    );

    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(0);
        }
    }, [currentPage, totalPages]);

    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col'>
            <Text text="Rkitech Blog" TwClassName='text-black font-primary text-4xl mb-5 w-full md:w-4/5 lg:w-2/3 mx-auto' />
            <Container TwClassName='flex-row flex-wrap w-full md:w-4/5 lg:w-2/3 mx-auto my-4 gap-4'>
                <Select
                    label="Sort"
                    TwClassName='flex-col'
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value as 'newest' | 'oldest');
                        setCurrentPage(0);
                    }}
                >
                    <option value="newest">Newest to oldest</option>
                    <option value="oldest">Oldest to newest</option>
                </Select>
                
                {categories.map(category => (
                    <Button
                        key={category}
                        TwClassName={`px-4 py-1 rounded-full ${
                            selectedCategory === category ? 'bg-primary text-white' : 'bg-white text-black border border-primary'
                        }`}
                        onClick={() => {
                            setSelectedCategory(category);
                            setCurrentPage(0); 
                        }}
                    >
                    {category}
                    </Button>
                ))}
                
            </Container>
            <Container TwClassName='flex-row h-full items-between flex-wrap w-full md:w-4/5 lg:w-2/3 mx-auto gap-4'>
                {paginatedPosts.map((post) => (
                    <Container
                        key={post.blogPostID}
                        onClick={() => clientNavigation(`${blogPage?.pagePath.toLowerCase() ?? ''}/${post.blogPostID}`, 'BlogPost', blogPage?.pageID ?? '')()}
                        TwClassName="flex flex-col relative border border-gray-200 shadow rounded w-full lg:w-[calc(50%-0.5rem)] xl:w-[calc(33%-0.5rem)]"
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
                TwClassName="mt-8"
            />
        </Container>
    );
};
export default Blog;
