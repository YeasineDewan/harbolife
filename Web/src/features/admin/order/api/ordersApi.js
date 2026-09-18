import { apiSlice } from "../../../../app/store/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.minTotal) queryParams.append("minTotal", params.minTotal);
        if (params.maxTotal) queryParams.append("maxTotal", params.maxTotal);

        return `/order/all-orders?${queryParams.toString()}`;
      },
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
    assignOrderToCourier: builder.mutation({
      query: ({ orderId, courierId }) => ({
        url: `/order/${orderId}/assign`,
        method: "PATCH",
        body: { courierId },
      }),
      invalidatesTags: ["Order", "CourierOrder"],
    }),
    getCouriersList: builder.query({
      query: () => "/user/couriers/list",
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetCouriersListQuery,
  useAssignOrderToCourierMutation,
  useDeleteOrderMutation,
} = ordersApi;
