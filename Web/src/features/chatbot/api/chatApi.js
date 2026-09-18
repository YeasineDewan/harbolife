import { apiSlice } from "../../../app/store/apiSlice";

const chatApiWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ["Chat"],
});

export const chatApi = chatApiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: () => "/chat",
      providesTags: ["Chat"],
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "/chat",
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Chat"],
    }),
    clearChatHistory: builder.mutation({
      query: () => ({
        url: "/chat",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useClearChatHistoryMutation,
} = chatApi;
