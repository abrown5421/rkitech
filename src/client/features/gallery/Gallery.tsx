import React, { useState } from 'react'; 
import Container from '../../../shared/components/container/Container';
import Pagination from '../../../shared/components/pagination/Pagination';
import Text from '../../../shared/components/text/Text';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Image from '../../../shared/components/image/Image';
import { openModal } from '../../../shared/features/modal/modalSlice';

const Gallery: React.FC = () => {
    const dispatch = useAppDispatch();
    const gallery = useAppSelector((state) => state.gallery.gallery);
    const [currentPage, setCurrentPage] = useState(0);
    const activeGallery = gallery.filter((image) => image.imageActive !== false);

    const postsPerPage = 9;
    const totalPages = Math.ceil(activeGallery.length / postsPerPage);

    const paginatedGallery = activeGallery.slice(
        currentPage * postsPerPage,
        currentPage * postsPerPage + postsPerPage
    );

    const handleOpenModal = (imageTitle: string, imageDesc: string, imageUrl: string) => {
        dispatch(openModal({
            title: imageTitle,
            modalType: 'galleryImageModal',
            modalProps: {
                imageDecription: imageDesc,
                imageUrl: imageUrl
            }
        }))
    }

    return (
        <Container TwClassName="min-h-[calc(100vh-50px)] p-4 flex-col">
            <Text 
                text="Our Gallery" 
                TwClassName="text-black font-primary text-4xl mb-5 w-full md:w-4/5 lg:w-2/3 mx-auto" 
            />

            <Container
                TwClassName="mx-auto w-full md:w-4/5 lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
                {paginatedGallery.map((image) => (
                    <Container
                        key={image.imageUrl}
                        TwClassName="w-full aspect-square overflow-hidden rounded-md"
                        onClick={() => handleOpenModal(image.imageName, image.imageDescription, image.imageUrl)}
                    >
                        <Image
                            src={image.imageUrl}
                            alt={image.imageName}
                            TwClassName="cursor-pointer object-cover w-full h-full"
                        />
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

export default Gallery;
