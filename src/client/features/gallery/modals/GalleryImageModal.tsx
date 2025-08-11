import React from 'react';
import Container from '../../../../shared/components/container/Container';
import type { GalleryImageModalContentProps } from '../../../../shared/features/modal/modalTypes';
import Image from '../../../../shared/components/image/Image';
import Text from '../../../../shared/components/text/Text';

const GalleryImageModal: React.FC<GalleryImageModalContentProps> = ({
    imageDecription,
    imageUrl,
}) => {

    return (
        <Container TwClassName='flex-col'>
            <Image
                src={imageUrl}
                alt={imageDecription}
                TwClassName="cursor-pointer object-fit w-full max-h-[calc(100vh-150px)]"
            />

            <Text text={imageDecription} TwClassName='mt-5 text-sm' />
        </Container>
    );
};
export default GalleryImageModal;
