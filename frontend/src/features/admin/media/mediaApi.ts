import { baseApi } from "../../../store/api/baseApi";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMediaTree: build.query<any, void>({
        query: () => '/media/tree',
        transformResponse: (response: { success: boolean; status: number; message: string; data: any }) => {
            return response.data;
        },
        providesTags: ['Media'],
    }),

  }),
  overrideExisting: false,
});

export const { useGetMediaTreeQuery } = mediaApi;