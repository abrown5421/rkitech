import { baseApi } from '../../store/api/baseApi';
import type { IEmployees } from './employeesTypes';

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEmployeess: build.query<IEmployees[], void>({
      query: () => '/employees',
      providesTags: ['Employees'],
      transformResponse: (response: any) => response.data,
    }),

    getEmployeesById: build.query<IEmployees, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
      transformResponse: (response: any) => response.data,
    }),

    createEmployees: build.mutation<IEmployees, Partial<IEmployees>>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employees'],
    }),

    updateEmployees: build.mutation<IEmployees, { id: string; data: Partial<IEmployees> }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employees', id }],
    }),

    deleteEmployees: build.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),

    loginEmployee: build.query<
      IEmployees | null,
      { email: string; password: string }
    >({
      query: () => '/employees',
      transformResponse: (response: any, _meta, arg) => {
        const employees: IEmployees[] = response.data;

        const match = employees.find(
          (e) =>
            e.employeeEmail.toLowerCase() === arg.email.toLowerCase() &&
            e.employeePassword === arg.password
        );

        return match || null;
      },
    }),
  }),
});

export const {
  useGetEmployeessQuery,
  useGetEmployeesByIdQuery,
  useCreateEmployeesMutation,
  useUpdateEmployeesMutation,
  useDeleteEmployeesMutation,
  useLazyLoginEmployeeQuery,
} = employeesApi;
