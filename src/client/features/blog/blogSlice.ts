import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Blog, BlogPost } from './blogTypes';


const initialState: Blog = {
  blogPosts: [],
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.blogPosts = action.payload;
    }
  },
});

export const { 
  setBlogPosts
} = blogSlice.actions;

export default blogSlice.reducer;
