import { useState } from "react";
import { useCreateBookingMutation } from "./bookingsApi";
import { useGetRoomsQuery } from "../rooms/roomsApi";

const CreateBookingForm = () => {
  const [createBooking, { isLoading, isSuccess, isError, error }] =
    useCreateBookingMutation();
  const { data: roomsResponse } = useGetRoomsQuery({ available: true });
  const availableRooms = roomsResponse?.data || [];

  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    nights: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData).unwrap();
      // Reset form on success
      setFormData({
        roomId: "",
        guestName: "",
        nights: 1,
      });
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Booking created successfully! Check-in date is set to today.
        </div>
      )}

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error?.data?.message || "Failed to create booking"}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Check-in date is automatically set to today's
          date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room *
          </label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a room</option>
            {availableRooms.map((room) => (
              <option key={room._id} value={room._id}>
                Room {room.roomNo} - {room.type} (${room.pricePerNight}/night)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guest Name *
          </label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter guest name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Nights *
          </label>
          <input
            type="number"
            name="nights"
            value={formData.nights}
            onChange={handleChange}
            min="1"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Check-in Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Estimated Check-out:</strong>{" "}
            {new Date(
              new Date().setDate(
                new Date().getDate() + parseInt(formData.nights || 1)
              )
            ).toLocaleDateString()}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Creating Booking..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBookingForm;
