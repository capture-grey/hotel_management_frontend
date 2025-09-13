const BookingAnalytics = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 overflow-x-auto">
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-200 min-w-[280px] md:min-w-0">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-2 md:p-3 mr-3 md:mr-4">
            <span className="text-green-600 text-lg md:text-xl">💰</span>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600">Total Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              ${analytics.totalRevenue?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-200 min-w-[280px] md:min-w-0">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-2 md:p-3 mr-3 md:mr-4">
            <span className="text-blue-600 text-lg md:text-xl">📊</span>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600">Total Bookings</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              {analytics.totalBookings?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-200 min-w-[280px] md:min-w-0">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-2 md:p-3 mr-3 md:mr-4">
            <span className="text-purple-600 text-lg md:text-xl">🧾</span>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600">
              Average Stay (Nights)
            </p>
            <p className="text-xl md:text-2xl font-bold text-purple-600">
              {analytics.averageStayDuration?.toFixed(1) || "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
