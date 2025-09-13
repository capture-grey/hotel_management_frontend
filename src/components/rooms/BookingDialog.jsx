import { useState } from "react";
import { X, Calendar, User } from "lucide-react";

const BookingDialog = ({ room, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: "",
    nights: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrice = room.pricePerNight * formData.nights;
  const checkInDate = new Date();
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + parseInt(formData.nights));

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Book Room {room.roomNo}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Room Details</h3>
            <p className="text-sm text-gray-600">
              {room.type} • {room.beds} bed{room.beds !== 1 ? "s" : ""} • $
              {room.pricePerNight}/night
            </p>
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Guest Name *
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter guest name"
            />
          </div>

          {/* Nights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Number of Nights *
            </label>
            <input
              type="number"
              name="nights"
              value={formData.nights}
              onChange={handleChange}
              min="1"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Booking Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-800">
              Booking Summary
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Check-in:</strong> {checkInDate.toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong> {checkOutDate.toLocaleDateString()}
              </p>
              <p>
                <strong>Total nights:</strong> {formData.nights}
              </p>
              <p>
                <strong>Total amount:</strong> ${totalPrice}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDialog;
