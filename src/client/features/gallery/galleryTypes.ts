export interface GalleryImage {
    imageDate: string;
    imageName: string;
    imageDescription: string;
    imageUrl: string;
}

export interface Gallery {
    gallery: GalleryImage[];
}