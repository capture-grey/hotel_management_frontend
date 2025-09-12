import { useState } from "react";
import { useAddRoomMutation } from "./roomsApi";

const AddRoomForm = () => {
  const [addRoom, { isLoading }] = useAddRoomMutation();
  const [formData, setFormData] = useState({
    roomNo: "",
    type: "single",
    beds: 1,
    pricePerNight: "",
    description: "",
    available: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRoom(formData).unwrap();
      // Reset form or navigate away
    } catch (error) {
      console.error("Failed to add room:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        {/* Form fields here */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
