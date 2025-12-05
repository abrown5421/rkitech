import { baseApi } from "../../../store/api/baseApi";
import type { IElement } from "./elementTypes";

export const elementsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getElements: build.query<IElement[], void>({
      query: () => '/elements',
      providesTags: ['Elements'],
      transformResponse: (response: any) => response.data,
    }),

    getElementsById: build.query<IElement[], string>({
      query: (id) => `/elements?_id=${id}`, 
      providesTags: (_result, _error, id) => [{ type: 'Elements', id }],
      transformResponse: (response: any) => response.data,
    }),

    createElements: build.mutation<IElement, Partial<IElement>>({
      query: (body) => ({
        url: '/elements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Elements'],
    }),

    updateElements: build.mutation<IElement, { id: string; data: Partial<IElement> }>({
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
  useGetElementsQuery,
  useGetElementsByIdQuery,
  useCreateElementsMutation,
  useUpdateElementsMutation,
  useDeleteElementsMutation,
} = elementsApi;
