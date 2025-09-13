const RoomView = ({ room, handleEdit, handleDelete }) => {
  return (
    <>
      <td className="p-2">{room.roomNo}</td>
      <td className="p-2">
        <span className="capitalize">{room.type}</span>
      </td>
      <td className="p-2">{room.beds}</td>
      <td className="p-2">${room.pricePerNight}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded text-xs ${
            room.available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {room.available ? "Yes" : "No"}
        </span>
      </td>
      <td className="p-2 space-x-2">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => handleEdit(room)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          onClick={() => handleDelete(room._id)}
        >
          Delete
        </button>
      </td>
    </>
  );
};

export default RoomView;
