import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let envUrl = (import.meta.env.VITE_API_BASE_URL || "https://rochetta-one.vercel.app/api").trim();
if (envUrl.endsWith("/")) envUrl = envUrl.slice(0, -1);
if (!envUrl.endsWith("/api")) envUrl = `${envUrl}/api`;

const BASE_URL = envUrl;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["User", "Product", "Cart", "Category"],
  endpoints: () => ({}),
});
