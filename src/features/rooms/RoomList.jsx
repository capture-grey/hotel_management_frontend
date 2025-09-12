import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} from "./roomsApi";
import { useState } from "react";

const RoomList = () => {
  const { data: response, isLoading, isError } = useGetRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const rooms = response?.data || [];

  const handleEdit = (room) => {
    setEditingId(room._id);
    setEditForm(room);
  };

  const handleSave = async () => {
    try {
      await updateRoom({ id: editingId, ...editForm }).unwrap();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Failed to update room:", error);
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

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error fetching rooms</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>

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
          {rooms.map((room) => (
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
                  room.type
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
                      onClick={() => deleteRoom(room._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
