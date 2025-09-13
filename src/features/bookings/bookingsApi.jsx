import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hotel-management-backend-seven.vercel.app/api",
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

    // Get single booking by ID
    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking", "Room"],
    }),

    // Update booking
    updateBooking: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Booking", "Room"],
    }),

    // Delete booking
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking", "Room"],
    }),

    // Checkout booking
    checkoutBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/checkout`,
        method: "POST",
      }),
      invalidatesTags: ["Booking", "BookingHistory", "Room"],
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
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useCheckoutBookingMutation,
  useGetBookingHistoryQuery,
} = bookingsApi;
