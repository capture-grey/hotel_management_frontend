const BookingPagination = ({ pagination, onPageChange }) => {
  if (pagination.pages <= 1) return null;

  return (
    <div className="mt-4 md:mt-6 flex justify-center items-center space-x-1 md:space-x-2">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="px-2 md:px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
        let pageNum;
        if (pagination.pages <= 5) {
          pageNum = i + 1;
        } else if (pagination.page <= 3) {
          pageNum = i + 1;
        } else if (pagination.page >= pagination.pages - 2) {
          pageNum = pagination.pages - 4 + i;
        } else {
          pageNum = pagination.page - 2 + i;
        }

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-2 md:px-3 py-1 border rounded-md text-sm ${
              pagination.page === pageNum
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
        <span className="px-1">...</span>
      )}

      {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
        <button
          onClick={() => onPageChange(pagination.pages)}
          className="px-2 md:px-3 py-1 border rounded-md text-sm bg-white hover:bg-gray-50"
        >
          {pagination.pages}
        </button>
      )}

      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
        className="px-2 md:px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

export default BookingPagination;
