import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, Plus, Calendar, BarChart3 } from "lucide-react";

// Custom NavLink component to handle active states
const NavLink = ({ to, children, icon: Icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
      }`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </Link>
  );
};

// Mobile menu component
const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/rooms" icon={Home} onClick={onClose}>
            Rooms
          </NavLink>
          <NavLink to="/create-room" icon={Plus} onClick={onClose}>
            Add Room
          </NavLink>
          <NavLink to="/bookings" icon={Calendar} onClick={onClose}>
            Bookings
          </NavLink>
          <NavLink to="/booking-summary" icon={BarChart3} onClick={onClose}>
            Booking Summary
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Made sticky */}
      <nav className="bg-gray-200 p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/rooms" className="text-xl font-bold text-gray-800">
            Hotel Manager
          </Link>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex space-x-1">
            <NavLink to="/rooms" icon={Home}>
              Rooms
            </NavLink>
            <NavLink to="/create-room" icon={Plus}>
              Add Room
            </NavLink>
            <NavLink to="/bookings" icon={Calendar}>
              Bookings
            </NavLink>
            <NavLink to="/booking-summary" icon={BarChart3}>
              Summary
            </NavLink>
          </div>

          {/* Mobile Menu Button - Hidden on desktop */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-300"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
