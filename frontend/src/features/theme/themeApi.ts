import { baseApi } from '../../store/api/baseApi';
import type { ITheme } from './themeTypes';

export const themeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getThemes: build.query<ITheme[], void>({
      query: () => '/themes',
      providesTags: ['Theme'],
      transformResponse: (response: any) => response.data,
    }),

    getThemeById: build.query<ITheme, string>({
      query: (id) => `/themes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Theme', id }],
      transformResponse: (response: any) => response.data,
    }),

    getActiveTheme: build.query<ITheme | undefined, void>({
      query: () => '/themes',
      providesTags: ['Theme'],
      transformResponse: (response: any) => {
        return response.data.find((theme: ITheme) => theme.active);
      },
    }),

    createTheme: build.mutation<ITheme, Partial<ITheme>>({
      query: (body) => ({
        url: '/themes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Theme'],
    }),

    updateTheme: build.mutation<ITheme, { id: string; data: Partial<ITheme> }>({
      query: ({ id, data }) => ({
        url: `/themes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Theme', id }],
    }),

    deleteTheme: build.mutation<void, string>({
      query: (id) => ({
        url: `/themes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Theme', id }],
    }),
  }),
});

export const {
  useGetThemesQuery,
  useGetThemeByIdQuery,
  useGetActiveThemeQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
} = themeApi;
