export interface GalleryImage {
    galleryPostID: string;
    imageActive: boolean;
    imageUpload: boolean;
    imageDate: string;
    imageName: string;
    imageDescription: string;
    imageUrl: string;
}

export interface Gallery {
    gallery: GalleryImage[];
}