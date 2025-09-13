import { useState } from "react";

const RoomEditForm = ({
  room,
  editForm,
  setEditForm,
  handleSave,
  handleCancel,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <td className="p-2">
        <input
          type="number"
          name="roomNo"
          value={editForm.roomNo || ""}
          onChange={handleChange}
          className="border p-1 w-16"
        />
      </td>
      <td className="p-2">
        <select
          name="type"
          value={editForm.type || ""}
          onChange={handleChange}
          className="border p-1"
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
      </td>
      <td className="p-2">
        <input
          type="number"
          name="beds"
          value={editForm.beds || ""}
          onChange={handleChange}
          className="border p-1 w-12"
        />
      </td>
      <td className="p-2">
        <input
          type="number"
          name="pricePerNight"
          value={editForm.pricePerNight || ""}
          onChange={handleChange}
          className="border p-1 w-20"
        />
      </td>
      <td className="p-2">
        <input
          type="checkbox"
          name="available"
          checked={editForm.available || false}
          onChange={handleChange}
        />
      </td>
      <td className="p-2 space-x-2">
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

export default RoomEditForm;
