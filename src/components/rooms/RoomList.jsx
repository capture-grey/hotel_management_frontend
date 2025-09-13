import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "../../features/rooms/roomsApi";
import RoomFilters from "./RoomFilters";
import RoomCard from "./RoomCard";
import BookingConflictDialog from "./BookingConflictDialog";
import RoomEditForm from "./RoomEditForm";

const RoomList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    type: "",
    available: "",
    minBeds: "",
    maxPrice: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
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
  const [updateRoom] = useUpdateRoomMutation();

  const rooms = response?.data || [];
  const pagination = response?.pagination || {};

  const handleEdit = (room) => {
    setEditingId(room._id);
    setEditForm(room);
  };

  const handleSave = async (formData) => {
    try {
      await updateRoom({ id: editingId, ...formData }).unwrap();
      setEditingId(null);
      setEditForm(null);
      refetch();
      toast.success("Room updated successfully!");
    } catch (error) {
      if (error.data?.data?.requiresAction) {
        // Close the edit form first, then show the conflict dialog
        setEditingId(null);
        setEditForm(null);

        // Use setTimeout to ensure the edit form is completely closed before showing the conflict dialog
        setTimeout(() => {
          setConfirmationDialog({
            open: true,
            type: "update",
            room: { _id: editingId, ...formData },
            bookingId: error.data.data.bookingId,
            message:
              "This room has an active booking. What would you like to do with the current booking?",
            actionType: "",
          });
        }, 100);
      } else {
        console.error("Failed to update room:", error);
        toast.error("Failed to update room");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditFormChange = (updatedForm) => {
    setEditForm(updatedForm);
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
      limit: 12,
      type: "",
      available: "",
      minBeds: "",
      maxPrice: "",
    });
  };

  if (isLoading) return <p className="p-6">Loading rooms...</p>;
  if (isError) return <p className="p-6 text-red-600">Error fetching rooms</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">Rooms Management</h2>

      <BookingConflictDialog
        confirmationDialog={confirmationDialog}
        setConfirmationDialog={setConfirmationDialog}
        refetch={refetch}
      />

      {editingId && (
        <RoomEditForm
          room={rooms.find((r) => r._id === editingId)}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onChange={handleEditFormChange}
        />
      )}

      <RoomFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        pagination={pagination}
        rooms={rooms}
      />

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onEdit={handleEdit}
            refetch={refetch}
            setConfirmationDialog={setConfirmationDialog}
          />
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No rooms found matching your filters</p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomList;
