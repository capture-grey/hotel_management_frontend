import { useState } from "react";
import {
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useCheckoutBookingMutation,
} from "./bookingsApi";

const BookingList = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetBookingsQuery(filters);
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [checkoutBooking] = useCheckoutBookingMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    guestName: "",
    nights: 1,
  });

  const bookings = response?.data || [];
  const pagination = response?.pagination || {};

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      guestName: booking.guestName,
      nights: booking.nights,
    });
  };

  const handleSave = async () => {
    try {
      await updateBooking({ id: editingId, ...editForm }).unwrap();
      setEditingId(null);
      setEditForm({ guestName: "", nights: 1 });
      refetch();
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ guestName: "", nights: 1 });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (bookingId) => {
    try {
      await checkoutBooking(bookingId).unwrap();
      refetch(); // Refresh the list after checkout
    } catch (error) {
      console.error("Failed to checkout booking:", error);
    }
  };

  if (isLoading) return <p className="p-6">Loading bookings...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Error fetching bookings</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Active Bookings</h2>

      <div className="mb-4 flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">
          Results per page:
        </label>
        <select
          value={filters.limit}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              limit: parseInt(e.target.value),
              page: 1,
            }))
          }
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Guest Name</th>
              <th className="p-2">Room No</th>
              <th className="p-2">Nights</th>
              <th className="p-2">Check-in Date</th>
              <th className="p-2">Total Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No active bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-2">
                    {editingId === booking._id ? (
                      <input
                        type="text"
                        name="guestName"
                        value={editForm.guestName}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      booking.guestName
                    )}
                  </td>
                  <td className="p-2">{booking.roomId?.roomNo}</td>
                  <td className="p-2">
                    {editingId === booking._id ? (
                      <input
                        type="number"
                        name="nights"
                        value={editForm.nights}
                        onChange={handleEditChange}
                        min="1"
                        className="border p-1 w-16"
                      />
                    ) : (
                      booking.nights
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    $
                    {booking.roomId
                      ? booking.nights * booking.roomId.pricePerNight
                      : "N/A"}
                  </td>
                  <td className="p-2 space-x-2">
                    {editingId === booking._id ? (
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
                          onClick={() => handleEdit(booking)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                          onClick={() => handleCheckout(booking._id)}
                        >
                          Checkout
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                          onClick={() => deleteBooking(booking._id)}
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

export default BookingList;
