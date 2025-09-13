import { useState } from "react";
import {
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useCheckoutBookingMutation,
} from "../../features/bookings/bookingsApi";
import BookingEditForm from "./BookingEditForm";

const BookingRow = ({ booking, refetch }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    guestName: "",
    nights: 1,
  });
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [checkoutBooking] = useCheckoutBookingMutation();

  const handleEdit = () => {
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

  const handleCheckout = async () => {
    try {
      await checkoutBooking(booking._id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to checkout booking:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(booking._id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  return (
    <tr className="border-t hover:bg-gray-50">
      {editingId === booking._id ? (
        <BookingEditForm
          editForm={editForm}
          handleEditChange={handleEditChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
          booking={booking}
        />
      ) : (
        <>
          <td className="p-3 text-center font-medium">{booking.guestName}</td>
          <td className="p-3 text-center">{booking.roomId?.roomNo}</td>
          <td className="p-3 text-center">{booking.nights}</td>{" "}
          {/* Added right padding */}
          <td className="p-3 text-center ">
            {" "}
            {/* Added left padding */}
            {new Date(booking.checkInDate).toLocaleDateString()}
          </td>
          <td className="p-3 text-center ">
            $
            {booking.roomId
              ? booking.nights * booking.roomId.pricePerNight
              : "N/A"}
          </td>
          <td className="p-3 text-center space-x-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export default BookingRow;
