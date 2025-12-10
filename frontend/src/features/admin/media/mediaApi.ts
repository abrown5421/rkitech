import { baseApi } from "../../../store/api/baseApi";
import { transformMediaTree } from "../../../utils/transformMediaTree";
import type {
  IMediaFolder,
  MediaUploadResponse,
  MediaRenamePayload,
  MediaReplacePayload,
} from "./mediaTypes";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMediaTree: build.query<IMediaFolder, void>({
      query: () => "/media/tree",
      providesTags: ["Media"],
      transformResponse: (response: any) => transformMediaTree(response.data),
    }),

    uploadMedia: build.mutation<MediaUploadResponse, FormData>({
      query: (formData) => ({
        url: "/media/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Media"],
    }),

    renameMedia: build.mutation<any, MediaRenamePayload>({
      query: (body) => ({
        url: "/media/rename",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Media"],
    }),

    replaceMedia: build.mutation<any, MediaReplacePayload>({
      query: ({ targetPath, file }) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("targetPath", targetPath);

        return {
          url: "/media/replace",
          method: "PUT",
          body: fd,
        };
      },
      invalidatesTags: ["Media"],
    }),

    deleteMedia: build.mutation<void, string>({
      query: (filePath) => ({
        url: `/media?path=${encodeURIComponent(filePath)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
  }),
});

export const {
  useGetMediaTreeQuery,
  useUploadMediaMutation,
  useRenameMediaMutation,
  useReplaceMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
