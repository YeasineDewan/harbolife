import { apiSlice } from "../../../app/store/apiSlice";

export const courierApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourierOrders: builder.query({
      query: ({ status } = {}) => ({
        url: "/order/courier/my-orders",
        params: { status },
      }),
      providesTags: ["CourierOrder"],
    }),
  }),
});

export const { useGetCourierOrdersQuery } = courierApi;
