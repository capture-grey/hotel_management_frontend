const BookingEditForm = ({
  editForm,
  handleEditChange,
  handleSave,
  handleCancel,
  booking,
}) => {
  return (
    <>
      <td className="p-2">
        <input
          type="text"
          name="guestName"
          value={editForm.guestName}
          onChange={handleEditChange}
          className="border p-1 w-full"
        />
      </td>
      <td className="p-2 text-left">{booking.roomId?.roomNo}</td>
      <td className="p-2">
        <input
          type="number"
          name="nights"
          value={editForm.nights}
          onChange={handleEditChange}
          min="1"
          className="border p-1 w-16 text-right"
        />
      </td>
      <td className="p-2 text-left">
        {new Date(booking.checkInDate).toLocaleDateString()}
      </td>
      <td className="p-2 text-right">
        $
        {booking.roomId
          ? editForm.nights * booking.roomId.pricePerNight
          : "N/A"}
      </td>
      <td className="p-2 text-center space-x-2">
        <button
          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </td>
    </>
  );
};

export default BookingEditForm; // Make sure this line is at the end
