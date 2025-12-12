import { baseApi } from "../../../store/api/baseApi";
import type { IPage } from "./pageTypes";

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPages: build.query<IPage[], void>({
      query: () => '/pages',
      providesTags: ['Page'],
      transformResponse: (response: any) => response.data, 
    }),

    getNonAdminPages: build.query<IPage[], void>({
      query: () => '/pages', 
      transformResponse: (response: any) => {
        return response.data.filter((page: IPage) => !page.pageUniqueId.startsWith('page_id_admin_'));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Page' as const, id: _id })),
              { type: 'Page', id: 'NON_ADMIN' },
            ]
          : [{ type: 'Page', id: 'NON_ADMIN' }],
    }),
    
    getPageById: build.query<IPage, string>({
      query: (id) => `/pages?_id=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Page', id }],
      transformResponse: (response: any) => response.data[0], 
    }),

    getPageByUniqueId: build.query<IPage, string>({
      query: (pageUniqueId) => `/pages?pageUniqueId=${pageUniqueId}`,
      providesTags: (_result, _error, id) => [{ type: 'Page', id }],
      transformResponse: (response: any) => response.data[0], 
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
  useGetNonAdminPagesQuery,
  useGetPageByIdQuery,
  useGetPageByUniqueIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;

