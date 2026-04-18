// frontend/src/components/Navbars/CustomerNavbar.js
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ChatIcon from "../ChatIcon";

const CustomerNavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `hover:text-cyan-400 transition text-sm font-medium ${isActive(path) ? "text-cyan-400" : "text-gray-300"}`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="text-lg font-bold text-cyan-400">
        🛠️ LocalService
      </Link>

      {/* Nav Links */}
      <div className="flex gap-5 font-medium">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/ai-chat" className={linkClass("/ai-chat")}>🤖 AI Chat</Link>
        <Link to="/customer/browse-workers" className={linkClass("/customer/browse-workers")}>Browse Workers</Link>
        <Link to="/customer/my-jobs" className={linkClass("/customer/my-jobs")}>My Jobs</Link>
        <Link to="/customer/dashboard" className={linkClass("/customer/dashboard")}>Dashboard</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <ChatIcon />
        <span className="text-sm text-gray-400">Hi, {user?.name}</span>
        <button onClick={handleLogout}
          className="bg-cyan-500 px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition text-sm">
          Logout
        </button>
      </div>

    </nav>
  );
};

export default CustomerNavBar;