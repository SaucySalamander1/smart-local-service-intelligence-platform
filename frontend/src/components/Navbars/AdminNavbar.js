import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminNavBar = () => {

  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (

    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

      <div className="text-lg font-bold text-red-400">
        Admin Panel
      </div>

      <div className="flex gap-6 font-medium">

        <Link to="/" className="hover:text-red-400 transition">
          Home
        </Link>

        <Link to="/admin/dashboard" className="hover:text-red-400 transition">
          Dashboard
        </Link>

        <Link to="/admin/workers" className="hover:text-red-400 transition">
          Workers
        </Link>

        <Link to="/admin/customers" className="hover:text-red-400 transition">
          Customers
        </Link>

      </div>

      <div className="flex items-center gap-6">

        <span className="text-sm text-gray-300">
          Welcome, {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </nav>

  );
};

export default AdminNavBar;