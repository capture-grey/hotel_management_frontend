import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hmb-five.vercel.app/api",
  }),
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: (params = {}) => ({
        url: "/rooms",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          type: params.type,
          available: params.available,
          minBeds: params.minBeds,
          maxPrice: params.maxPrice,
        },
      }),
      providesTags: ["Room"],
    }),
    getRoom: builder.query({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),
    addRoom: builder.mutation({
      query: (room) => ({
        url: "/rooms",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/rooms/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id },
        "Room",
      ],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),
    // Add endpoints for handling booking conflicts
    updateRoomWithAction: builder.mutation({
      query: ({ id, forceUpdate, checkoutBooking, ...updates }) => ({
        url: `/rooms/${id}`,
        method: "PUT",
        body: { ...updates, forceUpdate, checkoutBooking },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id },
        "Room",
      ],
    }),
    deleteRoomWithAction: builder.mutation({
      query: ({ id, forceDelete, checkoutBooking }) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
        body: { forceDelete, checkoutBooking },
      }),
      invalidatesTags: ["Room"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomWithActionMutation,
  useDeleteRoomWithActionMutation,
} = roomsApi;
