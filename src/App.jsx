import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import Bookings from "./pages/Bookings";
import BookingSummary from "./pages/BookingSummary";

function App() {
  return (
    <Router>
      <Navbar />

      <main className="container mx-auto p-4">
        <Routes>
          {/* Redirect / to /rooms */}
          <Route path="/" element={<Navigate to="/rooms" replace />} />

          <Route path="/rooms" element={<Rooms />} />
          <Route path="/create-room" element={<AddRoom />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
