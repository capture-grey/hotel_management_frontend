import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import Bookings from "./pages/Bookings";
import CreateBooking from "./pages/CreateBooking";
import BookingSummary from "./pages/BookingSummary";
import BookingList from "./features/bookings/BookingList";
import CreateBookingForm from "./features/bookings/CreateBookingForm";
//import BookingSummary from "./features/bookings/BookingSummary";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex space-x-4">
        <Link
          to="/rooms"
          className="px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Rooms
        </Link>
        <Link
          to="/create-room"
          className="px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Add Room
        </Link>
        <Link
          to="/bookings"
          className="px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Bookings
        </Link>
        <Link
          to="/create-booking"
          className="px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Create Booking
        </Link>
        <Link
          to="/booking-summary"
          className="px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Booking Summary
        </Link>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Rooms />} />{" "}
          {/* Changed from RoomList to Rooms */}
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/create-room" element={<AddRoom />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
