import { apiSlice } from "../../../../app/store/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page, limit, search, role, is_active }) => {
        let params = new URLSearchParams({ page, limit });
        if (search) params.append("search", search);
        if (role) params.append("role", role);
        if (is_active !== "") params.append("is_active", is_active);

        return `/user?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/user/create",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    toggleUserStatus: builder.mutation({
      query: ({ userId, is_active }) => ({
        url: `/user/${userId}/status`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Users"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useGetUserByIdQuery,
} = usersApi;
