import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Booking", "BookingHistory"],
  endpoints: (builder) => ({
    // Get all bookings with pagination
    getBookings: builder.query({
      query: (params = {}) => ({
        url: "/bookings",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ["Booking"],
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Update booking
    updateBooking: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Delete booking
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Checkout booking
    checkoutBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/checkout`,
        method: "POST",
      }),
      invalidatesTags: ["Booking", "BookingHistory"],
    }),

    // Get booking history (includes analytics in response)
    getBookingHistory: builder.query({
      query: (params = {}) => ({
        url: "/bookings/summary",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ["BookingHistory"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useCheckoutBookingMutation,
  useGetBookingHistoryQuery,
} = bookingsApi;
