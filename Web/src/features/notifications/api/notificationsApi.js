import { apiSlice } from "../../../app/store/apiSlice";

const notificationsApiWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: ["Notification"],
});

export const notificationsApi = notificationsApiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: "/notifications",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Notification",
                id: _id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),
    getUnreadCount: builder.query({
      query: () => "/notifications/unread-count",
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
