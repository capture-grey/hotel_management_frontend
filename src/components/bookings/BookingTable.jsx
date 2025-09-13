import BookingRow from "./BookingRow";

const BookingTable = ({ bookings, refetch }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-center">Guest Name</th>
            <th className="p-3 text-center">Room No</th>
            <th className="p-3 text-center ">Nights</th>{" "}
            {/* Added right padding */}
            <th className="p-3 text-center">Check-in Date</th>{" "}
            {/* Added left padding */}
            <th className="p-3 text-center">Total Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No active bookings found
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <BookingRow
                key={booking._id}
                booking={booking}
                refetch={refetch}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
