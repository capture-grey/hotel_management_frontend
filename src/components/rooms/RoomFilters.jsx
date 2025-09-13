const RoomFilters = ({
  filters,
  handleFilterChange,
  clearFilters,
  pagination,
  rooms,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <select
            name="available"
            value={filters.available}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Occupied</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Beds
          </label>
          <input
            type="number"
            name="minBeds"
            value={filters.minBeds}
            onChange={handleFilterChange}
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Min beds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Max price"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {rooms.length} of {pagination.total || 0} rooms
        </div>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Results per page */}
      <div className="mt-4 flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">
          Results per page:
        </label>
        <select
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default RoomFilters;
