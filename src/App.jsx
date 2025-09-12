import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import RoomList from "./features/rooms/RoomList";
import AddRoomForm from "./features/rooms/AddRoomForm";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex space-x-4">
        <Link to="/rooms">Rooms</Link>
        <Link to="/create-room">Add Room</Link>
      </nav>
      <Routes>
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/create-room" element={<AddRoomForm />} />
      </Routes>
    </Router>
  );
}

export default App;
