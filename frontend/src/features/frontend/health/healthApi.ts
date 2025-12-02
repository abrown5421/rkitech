import { baseApi } from "../../../store/api/baseApi";

export const healthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHealth: build.query<{ success: boolean; message: string }, void>({
      query: () => '/health',
    }),
  }),
  overrideExisting: false,
});

export const { useGetHealthQuery } = healthApi;
