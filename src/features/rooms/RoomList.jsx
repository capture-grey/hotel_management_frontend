import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} from "./roomsApi";
import {
  useCheckoutBookingMutation,
  useDeleteBookingMutation,
  useGetBookingQuery,
} from "../bookings/bookingsApi";

const RoomList = () => {
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "",
    available: "",
    minBeds: "",
    maxPrice: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    type: "", // 'delete' or 'update'
    room: null,
    bookingId: null,
    message: "",
    actionType: "", // 'checkout' or 'delete'
  });

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetRoomsQuery(filters);
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [checkoutBooking] = useCheckoutBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const rooms = response?.data || [];
  const pagination = response?.pagination || {};

  // Fetch booking details when dialog opens with a bookingId
  const { data: bookingData } = useGetBookingQuery(
    confirmationDialog.bookingId,
    {
      skip: !confirmationDialog.bookingId,
    }
  );

  const handleEdit = (room) => {
    setEditingId(room._id);
    setEditForm(room);
  };

  const handleSave = async () => {
    try {
      await updateRoom({ id: editingId, ...editForm }).unwrap();
      setEditingId(null);
      setEditForm({});
      refetch();
      toast.success("Room updated successfully!");
    } catch (error) {
      // FIXED: Check the correct response structure
      if (error.data?.data?.requiresAction) {
        // Show confirmation dialog for booking conflict
        setConfirmationDialog({
          open: true,
          type: "update",
          room: { _id: editingId, ...editForm },
          bookingId: error.data.data.bookingId,
          message:
            "This room has an active booking. What would you like to do with the current booking?",
          actionType: "",
        });
      } else {
        console.error("Failed to update room:", error);
        toast.error("Failed to update room");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId).unwrap();
      refetch();
      toast.success("Room deleted successfully!");
    } catch (error) {
      // FIXED: Check the correct response structure
      if (error.data?.data?.requiresAction) {
        // Show confirmation dialog for booking conflict
        setConfirmationDialog({
          open: true,
          type: "delete",
          room: rooms.find((r) => r._id === roomId),
          bookingId: error.data.data.bookingId,
          message:
            "This room has an active booking. What would you like to do with the current booking?",
          actionType: "",
        });
      } else {
        console.error("Failed to delete room:", error);
        toast.error("Failed to delete room");
      }
    }
  };

  const handleConfirmAction = async () => {
    const { type, room, bookingId, actionType } = confirmationDialog;

    if (!actionType) {
      toast.error("Please select an action");
      return;
    }

    try {
      // First handle the booking based on user selection
      if (actionType === "checkout") {
        await checkoutBooking(bookingId).unwrap();
        toast.success("Booking checked out successfully!");
      } else if (actionType === "delete") {
        await deleteBooking(bookingId).unwrap();
        toast.success("Booking deleted successfully!");
      }

      // Then handle the room operation
      if (type === "delete") {
        await deleteRoom(room._id).unwrap();
        toast.success("Room deleted successfully!");
      } else if (type === "update") {
        await updateRoom({ id: room._id, ...room }).unwrap();
        toast.success("Room updated successfully!");
      }

      refetch();
      setConfirmationDialog({
        open: false,
        type: "",
        room: null,
        bookingId: null,
        message: "",
        actionType: "",
      });
    } catch (error) {
      console.error("Failed to complete action:", error);
      toast.error("Failed to complete operation");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      type: "",
      available: "",
      minBeds: "",
      maxPrice: "",
    });
  };

  if (isLoading) return <p className="p-6">Loading rooms...</p>;
  if (isError) return <p className="p-6 text-red-600">Error fetching rooms</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>

      {/* Confirmation Dialog */}
      {confirmationDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">Booking Conflict</h3>
            <p className="text-gray-700 mb-4">{confirmationDialog.message}</p>

            {bookingData?.data && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Guest:</strong> {bookingData.data.guestName}
                  <br />
                  <strong>Room:</strong> {bookingData.data.roomId.roomNo}
                  <br />
                  <strong>Check-in:</strong>{" "}
                  {new Date(bookingData.data.checkInDate).toLocaleDateString()}
                  <br />
                  <strong>Nights:</strong> {bookingData.data.nights}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-4">
              <p className="font-medium mb-2">Select an action:</p>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    setConfirmationDialog((prev) => ({
                      ...prev,
                      actionType: "checkout",
                    }))
                  }
                  className={`px-4 py-2 rounded-md ${
                    confirmationDialog.actionType === "checkout"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  Checkout Booking
                </button>
                <button
                  onClick={() =>
                    setConfirmationDialog((prev) => ({
                      ...prev,
                      actionType: "delete",
                    }))
                  }
                  className={`px-4 py-2 rounded-md ${
                    confirmationDialog.actionType === "delete"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Delete Booking
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmationDialog({
                    open: false,
                    type: "",
                    room: null,
                    bookingId: null,
                    message: "",
                    actionType: "",
                  })
                }
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={!confirmationDialog.actionType}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              name="available"
              value={filters.available}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Occupied</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Beds
            </label>
            <input
              type="number"
              name="minBeds"
              value={filters.minBeds}
              onChange={handleFilterChange}
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Min beds"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Max price"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {rooms.length} of {pagination.total || 0} rooms
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results per page */}
      <div className="mb-4 flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">
          Results per page:
        </label>
        <select
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      {/* Rooms Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Room No</th>
              <th className="p-2">Type</th>
              <th className="p-2">Beds</th>
              <th className="p-2">Price/Night</th>
              <th className="p-2">Available</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No rooms found matching your filters
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id} className="border-t">
                  <td className="p-2">
                    {editingId === room._id ? (
                      <input
                        type="number"
                        name="roomNo"
                        value={editForm.roomNo || ""}
                        onChange={handleChange}
                        className="border p-1 w-16"
                      />
                    ) : (
                      room.roomNo
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === room._id ? (
                      <select
                        name="type"
                        value={editForm.type || ""}
                        onChange={handleChange}
                        className="border p-1"
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="suite">Suite</option>
                      </select>
                    ) : (
                      <span className="capitalize">{room.type}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === room._id ? (
                      <input
                        type="number"
                        name="beds"
                        value={editForm.beds || ""}
                        onChange={handleChange}
                        className="border p-1 w-12"
                      />
                    ) : (
                      room.beds
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === room._id ? (
                      <input
                        type="number"
                        name="pricePerNight"
                        value={editForm.pricePerNight || ""}
                        onChange={handleChange}
                        className="border p-1 w-20"
                      />
                    ) : (
                      `$${room.pricePerNight}`
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === room._id ? (
                      <input
                        type="checkbox"
                        name="available"
                        checked={editForm.available || false}
                        onChange={handleChange}
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          room.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.available ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    {editingId === room._id ? (
                      <>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                          onClick={() => handleEdit(room)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                          onClick={() => handleDelete(room._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border rounded-md ${
                  pagination.page === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomList;
