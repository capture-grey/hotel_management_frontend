import { useState } from "react";
import { useGetBookingHistoryQuery } from "../features/bookings/bookingsApi";
import BookingAnalytics from "../components/bookingsHistory/BookingAnalytics";
import BookingHistoryTable from "../components/bookingsHistory/BookingHistoryTable";

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
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Booking Analytics & History
      </h2>

      <BookingAnalytics analytics={analytics} />

      <BookingHistoryTable
        history={history}
        filters={filters}
        pagination={pagination}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BookingSummary;
