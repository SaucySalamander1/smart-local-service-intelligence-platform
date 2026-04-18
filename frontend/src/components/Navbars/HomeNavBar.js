// frontend/src/components/Navbars/HomeNavBar.js
import { Link, useLocation } from "react-router-dom";

const HomeNavbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `hover:text-cyan-400 transition text-sm font-medium ${isActive(path) ? "text-cyan-400" : "text-gray-300"}`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-cyan-400">
        🛠️ LocalService
      </Link>

      {/* Nav Links */}
      <div className="flex gap-5">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/services" className={linkClass("/services")}>Services</Link>
        <Link to="/become-worker" className={linkClass("/become-worker")}>Become Worker</Link>
        <Link to="/about" className={linkClass("/about")}>About</Link>
        <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        <Link to="/login"
          className="text-sm text-gray-300 hover:text-cyan-400 transition font-medium">
          Login
        </Link>
        <Link to="/register"
          className="bg-cyan-500 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition text-sm font-medium">
          Register
        </Link>
        <Link to="/admin/login"
          className="text-sm text-gray-400 hover:text-red-400 transition">
          Admin
        </Link>
      </div>

    </nav>
  );
};

export default HomeNavbar;