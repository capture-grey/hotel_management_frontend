import { useState } from "react";
import { useAddRoomMutation } from "./roomsApi";

const AddRoomForm = () => {
  const [addRoom, { isLoading, isSuccess, isError, error }] =
    useAddRoomMutation();
  const [formData, setFormData] = useState({
    roomNo: "",
    type: "single",
    beds: 1,
    pricePerNight: "",
    description: "",
    available: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert number fields to actual numbers
      const dataToSend = {
        ...formData,
        roomNo: parseInt(formData.roomNo),
        beds: parseInt(formData.beds),
        pricePerNight: parseFloat(formData.pricePerNight),
      };

      await addRoom(dataToSend).unwrap();
      // Reset form after successful submission
      setFormData({
        roomNo: "",
        type: "single",
        beds: 1,
        pricePerNight: "",
        description: "",
        available: true,
      });
    } catch (error) {
      console.error("Failed to add room:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Room</h2>

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Room added successfully!
        </div>
      )}

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error?.data?.message || "Failed to add room"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Number *
          </label>
          <input
            type="number"
            name="roomNo"
            value={formData.roomNo}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Beds *
          </label>
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Per Night ($) *
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Available for booking
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Adding Room..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
