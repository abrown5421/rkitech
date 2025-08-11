import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Gallery, GalleryImage } from './galleryTypes';

const initialState: Gallery = {
  gallery: [],
};

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setGalleryPosts: (state, action: PayloadAction<GalleryImage[]>) => {
      state.gallery = action.payload;
    }
  },
});

export const { 
  setGalleryPosts
} = gallerySlice.actions;

export default gallerySlice.reducer;
