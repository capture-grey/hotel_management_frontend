import { toast } from "react-toastify";
import {
  useCheckoutBookingMutation,
  useDeleteBookingMutation,
  useGetBookingQuery,
} from "../../features/bookings/bookingsApi";
import {
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} from "../../features/rooms/roomsApi";

const BookingConflictDialog = ({
  confirmationDialog,
  setConfirmationDialog,
  refetch,
}) => {
  const [checkoutBooking] = useCheckoutBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();

  const { data: bookingData } = useGetBookingQuery(
    confirmationDialog.bookingId,
    {
      skip: !confirmationDialog.bookingId,
    }
  );

  const handleConfirmAction = async () => {
    const { type, room, bookingId, actionType } = confirmationDialog;

    if (!actionType) {
      toast.error("Please select an action");
      return;
    }

    try {
      if (actionType === "checkout") {
        await checkoutBooking(bookingId).unwrap();
        toast.success("Booking checked out successfully!");
      } else if (actionType === "delete") {
        await deleteBooking(bookingId).unwrap();
        toast.success("Booking deleted successfully!");
      }

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

  if (!confirmationDialog.open) return null;

  return (
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
  );
};

export default BookingConflictDialog;
