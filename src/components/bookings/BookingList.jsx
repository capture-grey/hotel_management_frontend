import { useState } from "react";
import { useGetBookingsQuery } from "../../features/bookings/bookingsApi";
import BookingFilters from "./BookingFilters";
import BookingTable from "./BookingTable";

const BookingList = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetBookingsQuery(filters);

  const bookings = response?.data || [];
  const pagination = response?.pagination || {};

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(limit),
      page: 1,
    }));
  };

  if (isLoading) return <p className="p-6">Loading bookings...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Error fetching bookings</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Active Bookings</h2>

      <BookingFilters limit={filters.limit} onLimitChange={handleLimitChange} />

      <BookingTable bookings={bookings} filters={filters} refetch={refetch} />

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
