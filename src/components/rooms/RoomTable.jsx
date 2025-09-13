import { useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} from "../../features/rooms/roomsApi";
import RoomEditForm from "./RoomEditForm";
import RoomView from "./RoomView";

const RoomTable = ({ rooms, setConfirmationDialog, refetch }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();

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
      if (error.data?.data?.requiresAction) {
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

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId).unwrap();
      refetch();
      toast.success("Room deleted successfully!");
    } catch (error) {
      if (error.data?.data?.requiresAction) {
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

  return (
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
                {editingId === room._id ? (
                  <RoomEditForm
                    room={room}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                ) : (
                  <RoomView
                    room={room}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;
