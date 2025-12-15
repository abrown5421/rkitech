import { baseApi } from "../../../store/api/baseApi";
import type { IUser } from "./userTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
      transformResponse: (response: any) => response.data,
    }),
    getUsersById: build.query<IUser[], string>({
      query: (id) => `/users?_id=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
      transformResponse: (response: any) => response.data,
    }),
    createUsers: build.mutation<IUser, Partial<IUser>>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    updateUsers: build.mutation<IUser, { id: string; data: Partial<IUser> }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Users', id }],
    }),
    deleteUsers: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    login: build.mutation<IUser, { email: string; password: string }>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByIdQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useLoginMutation,
} = usersApi;
