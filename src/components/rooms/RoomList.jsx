import { useState } from "react";
import { toast } from "react-toastify";
import { useGetRoomsQuery } from "../../features/rooms/roomsApi";
import RoomFilters from "./RoomFilters";
import RoomTable from "./RoomTable";
import BookingConflictDialog from "./BookingConflictDialog";

const RoomList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "",
    available: "",
    minBeds: "",
    maxPrice: "",
  });

  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    type: "",
    room: null,
    bookingId: null,
    message: "",
    actionType: "",
  });

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetRoomsQuery(filters);

  const rooms = response?.data || [];
  const pagination = response?.pagination || {};

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

      <BookingConflictDialog
        confirmationDialog={confirmationDialog}
        setConfirmationDialog={setConfirmationDialog}
        refetch={refetch}
      />

      <RoomFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        pagination={pagination}
        rooms={rooms}
      />

      <RoomTable
        rooms={rooms}
        filters={filters}
        handleFilterChange={handleFilterChange}
        setConfirmationDialog={setConfirmationDialog}
        refetch={refetch}
      />

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
