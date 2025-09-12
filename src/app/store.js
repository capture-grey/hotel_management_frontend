import { configureStore } from "@reduxjs/toolkit";
import { roomsApi } from "../features/rooms/roomsApi";
import { bookingsApi } from "../features/bookings/bookingsApi";

const store = configureStore({
  reducer: {
    [roomsApi.reducerPath]: roomsApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roomsApi.middleware, bookingsApi.middleware),
});

export default store;
