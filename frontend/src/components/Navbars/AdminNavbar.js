// frontend/src/components/Navbars/AdminNavbar.js
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminNavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `hover:text-red-400 transition text-sm font-medium ${isActive(path) ? "text-red-400" : "text-gray-300"}`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <Link to="/admin/dashboard" className="text-lg font-bold text-red-400">
        ⚙️ Admin Panel
      </Link>

      {/* Nav Links */}
      <div className="flex gap-5">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>Dashboard</Link>
        <Link to="/admin/workers" className={linkClass("/admin/workers")}>Workers</Link>
        <Link to="/admin/customers" className={linkClass("/admin/customers")}>Customers</Link>
        <Link to="/admin/jobs" className={linkClass("/admin/jobs")}>📋 Jobs</Link>
        <Link to="/admin/payments" className={linkClass("/admin/payments")}>💰 Payments</Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Hi, {user?.name}</span>
        <button onClick={handleLogout}
          className="bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm">
          Logout
        </button>
      </div>

    </nav>
  );
};

export default AdminNavBar;