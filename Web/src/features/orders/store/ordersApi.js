import { apiSlice } from "../../../app/store/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/order",
      providesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/order/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order", "Product"],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Cart", "Product"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCancelOrderMutation,
  useCreateOrderMutation,
} = ordersApi;
