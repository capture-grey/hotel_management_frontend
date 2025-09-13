import BookingPagination from "./BookingPagination";

const BookingHistoryTable = ({
  history,
  filters,
  pagination,
  onLimitChange,
  onPageChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h3 className="text-lg md:text-xl font-semibold">Booking History</h3>
        <div className="flex items-center space-x-2">
          <label className="text-xs md:text-sm font-medium text-gray-700   ">
            Results per page:
          </label>
          <select
            value={filters.limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-2 md:px-3 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-center">Guest</th>
              <th className="p-2 text-center hidden md:table-cell">Room No</th>
              <th className="p-2 text-center hidden lg:table-cell">Type</th>
              <th className="p-2 text-center">Check-in</th>
              <th className="p-2 text-center hidden md:table-cell">
                Check-out
              </th>
              <th className="p-2 text-center">Nights</th>
              <th className="p-2 text-center hidden lg:table-cell">Amount</th>
              <th className="p-2 text-center">Status</th>
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
                  <td className="p-2 text-center font-medium">
                    {record.guestName}
                  </td>
                  <td className="p-2 text-center hidden md:table-cell">
                    {record.roomNo}
                  </td>
                  <td className="p-2 text-center hidden lg:table-cell capitalize">
                    {record.roomType}
                  </td>
                  <td className="p-2 text-center   ">
                    {new Date(record.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-center hidden md:table-cell   ">
                    {new Date(record.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-center   ">
                    <span className="md:hidden">
                      {record.actualNightsStayed}
                    </span>
                    <span className="hidden md:inline">
                      {record.nights} / {record.actualNightsStayed}
                    </span>
                  </td>
                  <td className="p-2 text-center hidden lg:table-cell   ">
                    ${record.totalAmount} / ${record.actualTotalAmount}
                  </td>
                  <td className="p-2 text-center">
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

      <BookingPagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default BookingHistoryTable;
