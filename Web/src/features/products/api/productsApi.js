import { apiSlice } from "../../../app/store/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        limit = 10,
        page = 1,
        top_selling,
        categoryName,
        search,
        sortPrice,
        minRating,
        is_active,
        requires_prescription,
        inStock,
        has_strips,
      } = {}) => {
        const params = new URLSearchParams({ limit, page });

        if (top_selling) params.append("top_selling", "true");

        if (categoryName && categoryName !== "") {
          params.append("categoryName", categoryName);
        }

        if (search) params.append("name", search);

        if (is_active !== undefined && is_active !== "") {
          params.append("is_active", is_active);
        }

        if (sortPrice) {
          params.append("sort", "price");
          params.append("order", sortPrice);
        }

        if (minRating) params.append("minRating", minRating);

        if (requires_prescription !== undefined && requires_prescription !== "") {
          params.append("requires_prescription", requires_prescription);
        }

        if (inStock !== undefined && inStock !== "") {
          params.append("inStock", inStock);
        }

        if (has_strips !== undefined && has_strips !== "") {
          params.append("has_strips", has_strips);
        }

        return `/products?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),
    getSavedProducts: builder.query({
      query: () => "/products/saved-items",
      providesTags: ["SavedItems"],
    }),

    toggleSavedProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/saved-items/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["SavedItems", "Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSavedProductsQuery,
  useToggleSavedProductMutation,
} = productsApi;
