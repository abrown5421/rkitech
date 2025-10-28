import { baseApi } from '../../store/api/baseApi';
import type { IConfiguration } from './configurationsTypes';

export const configApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConfigs: build.query<IConfiguration[], void>({
      query: () => '/configurations',
      providesTags: ['Configuration'],
      transformResponse: (response: any) => response.data,
    }),

    getConfigByKey: build.query<IConfiguration | null, string>({
      query: (key) => `/configurations?key=${key}`,
      transformResponse: (response: any) => {
        const configs = response.data ?? [];
        return configs.length > 0 ? configs[0] : null;
      },
      providesTags: (_result, _error, key) => [{ type: 'Configuration', id: key }],
    }),

    createConfig: build.mutation<IConfiguration, Partial<IConfiguration>>({
      query: (body) => ({
        url: '/configurations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Configuration'],
    }),

    updateConfig: build.mutation<IConfiguration, { id: string; data: Partial<IConfiguration> }>({
      query: ({ id, data }) => ({
        url: `/configurations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Configuration'],
    }),

    deleteConfig: build.mutation<void, string>({
      query: (id) => ({
        url: `/configurations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Configuration'],
    }),
  }),
});

export const {
  useGetConfigsQuery,
  useGetConfigByKeyQuery,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation,
} = configApi;
