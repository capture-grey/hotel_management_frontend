import { useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Trash2, Bed } from "lucide-react";
import { useDeleteRoomMutation } from "../../features/rooms/roomsApi";
import { useCreateBookingMutation } from "../../features/bookings/bookingsApi";
import BookingDialog from "./BookingDialog";

const RoomCard = ({ room, onEdit, refetch, setConfirmationDialog }) => {
  const [deleteRoom] = useDeleteRoomMutation();
  const [createBooking] = useCreateBookingMutation();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteRoom(room._id).unwrap();
      refetch();
      toast.success("Room deleted successfully!");
      setShowDeleteConfirm(false);
    } catch (error) {
      if (error.data?.data?.requiresAction) {
        setConfirmationDialog({
          open: true,
          type: "delete",
          room: room,
          bookingId: error.data.data.bookingId,
          message:
            "This room has an active booking. What would you like to do?",
          actionType: "",
        });
        setShowDeleteConfirm(false);
      } else {
        console.error("Failed to delete room:", error);
        toast.error("Failed to delete room");
      }
    }
  };

  const handleBookNow = () => {
    if (room.available) {
      setShowBookingDialog(true);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      await createBooking({
        roomId: room._id,
        ...bookingData,
      }).unwrap();
      setShowBookingDialog(false);
      refetch();
      toast.success("Booking created successfully!");
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error("Failed to create booking");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Header with actions */}
        <div className="flex justify-between items-start p-4 pb-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">
                Room {room.roomNo}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  room.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {room.available ? "Available" : "Booked"}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              ${room.pricePerNight}
              <span className="text-sm font-normal text-gray-500">/night</span>
            </p>
          </div>
          <div className="flex space-x-2 ml-2">
            <button
              onClick={() => onEdit(room)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit room"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete room"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Room details */}
        <div className="px-4 pb-4">
          <div className="flex items-center text-gray-600 mb-2">
            <Bed size={16} className="mr-2" />
            <span className="capitalize">
              {room.type} • {room.beds} bed{room.beds !== 1 ? "s" : ""}
            </span>
          </div>

          {room.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {room.description}
            </p>
          )}

          {/* Book button */}
          <button
            onClick={handleBookNow}
            disabled={!room.available}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              room.available
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {room.available ? "Book Now" : "Occupied"}
          </button>
        </div>
      </div>

      {/* Booking Dialog */}
      {showBookingDialog && (
        <BookingDialog
          room={room}
          onClose={() => setShowBookingDialog(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete Room {room.roomNo}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;
