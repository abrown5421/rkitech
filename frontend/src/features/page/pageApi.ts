
import { baseApi } from '../../store/api/baseApi';
import type { IPage } from './pageTypes';

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPages: build.query<IPage[], void>({
      query: () => '/pages',
      providesTags: ['Page'],
      transformResponse: (response: any) => response.data, 
    }),
    createPage: build.mutation<IPage, Partial<IPage>>({
      query: (body) => ({
        url: '/pages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Page'],
    }),
    updatePage: build.mutation<IPage, { id: string; data: Partial<IPage> }>({
      query: ({ id, data }) => ({
        url: `/pages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Page'],
    }),
    deletePage: build.mutation<void, string>({
      query: (id) => ({
        url: `/pages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Page'],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;
