import { apiSlice } from "../../../../app/store/apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (params) => ({
        url: "/reviews",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Review", id: _id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),
    getTopReviews: builder.query({
      query: () => "/reviews/top",
      providesTags: ["Review"],
    }),

    getProductReviews: builder.query({
      query: (productId) => `/reviews?product=${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    getReviewById: builder.query({
      query: (id) => `/reviews/${id}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    addReview: builder.mutation({
      query: (newReview) => ({
        url: "/reviews",
        method: "POST",
        body: newReview,
      }),
      invalidatesTags: (result, error, { product }) => [
        { type: "Review", id: product },
        "Product",
        "Review",
      ],
    }),

    updateReview: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Product"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetProductReviewsQuery,
  useGetTopReviewsQuery,
  useGetReviewByIdQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
