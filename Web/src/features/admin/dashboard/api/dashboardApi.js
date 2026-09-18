import { apiSlice } from "../../../../app/store/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
    }),
    getRevenueForecast: builder.query({
      query: () => "/dashboard/revenue-forecast",
    }),
    getCustomerSegments: builder.query({
      query: () => "/dashboard/customer-segments",
    }),
    getProductBundles: builder.query({
      query: () => "/dashboard/product-bundles",
    }),
    getInventoryAnalysis: builder.query({
      query: () => "/dashboard/inventory-analysis",
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueForecastQuery,
  useGetCustomerSegmentsQuery,
  useGetProductBundlesQuery,
  useGetInventoryAnalysisQuery,
} = dashboardApi;
