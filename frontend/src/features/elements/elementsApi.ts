import { baseApi } from '../../store/api/baseApi';
import type { IElements } from './elementsTypes';

export const elementsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getElementss: build.query<IElements[], void>({
      query: () => '/elements',
      providesTags: ['Elements'],
      transformResponse: (response: any) => response.data,
    }),

    getElementsById: build.query<IElements, string>({
      query: (id) => `/elements/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Elements', id }],
      transformResponse: (response: any) => response.data,
    }),

    createElements: build.mutation<IElements, Partial<IElements>>({
      query: (body) => ({
        url: '/elements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Elements'],
    }),

    updateElements: build.mutation<IElements, { id: string; data: Partial<IElements> }>({
      query: ({ id, data }) => ({
        url: `/elements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Elements', id }],
    }),

    deleteElements: build.mutation<void, string>({
      query: (id) => ({
        url: `/elements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Elements', id }],
    }),
  }),
});

export const {
  useGetElementssQuery,
  useGetElementsByIdQuery,
  useCreateElementsMutation,
  useUpdateElementsMutation,
  useDeleteElementsMutation,
} = elementsApi;
