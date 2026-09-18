import { apiSlice } from "../../../../app/store/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   getCategories: builder.query({
      query: (args = {}) => {
        const { page = 1, limit = 10, search = "" } = args;
        
        let params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        
        return `/categories?${params.toString()}`;
      },
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Category", id: slug }],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
