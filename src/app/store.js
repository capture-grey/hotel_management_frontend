import { configureStore } from "@reduxjs/toolkit";
import { roomsApi } from "../features/rooms/roomsApi";

// Create the store
const store = configureStore({
  reducer: {
    [roomsApi.reducerPath]: roomsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roomsApi.middleware),
});

// Export as default
export default store;
