const BookingFilters = ({ limit, onLimitChange }) => {
  return (
    <div className="mb-4 flex items-center">
      <label className="text-sm font-medium text-gray-700 mr-2">
        Results per page:
      </label>
      <select
        value={limit}
        onChange={(e) => onLimitChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  );
};

export default BookingFilters;
