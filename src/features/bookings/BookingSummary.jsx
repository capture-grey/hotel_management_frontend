import { useState } from "react";
import { useGetBookingHistoryQuery } from "./bookingsApi";

const BookingSummary = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const {
    data: historyResponse,
    isLoading,
    isError,
  } = useGetBookingHistoryQuery(filters);

  const history = historyResponse?.data || [];
  const analytics = historyResponse?.analytics || {};
  const pagination = historyResponse?.pagination || {};

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  if (isLoading) return <p className="p-6">Loading booking data...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Error fetching booking data</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Booking Analytics & History</h2>

      {/* Simple Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${analytics.totalRevenue?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.totalBookings?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Average Stay Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <span className="text-purple-600 text-xl">🏨</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Stay (Nights)</p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.averageStayDuration?.toFixed(1) || "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Booking History</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Results per page:
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Guest Name</th>
                <th className="p-2">Room No</th>
                <th className="p-2">Room Type</th>
                <th className="p-2">Check-in</th>
                <th className="p-2">Check-out</th>
                <th className="p-2">Planned/Actual Nights</th>
                <th className="p-2">Planned/Actual Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No booking history found
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{record.guestName}</td>
                    <td className="p-2">{record.roomNo}</td>
                    <td className="p-2 capitalize">{record.roomType}</td>
                    <td className="p-2">
                      {new Date(record.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {new Date(record.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {record.nights} / {record.actualNightsStayed}
                    </td>
                    <td className="p-2">
                      ${record.totalAmount} / ${record.actualTotalAmount}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          record.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "early_checkout"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status.replace("_", " ")}
                      </span>
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
    </div>
  );
};

export default BookingSummary;
