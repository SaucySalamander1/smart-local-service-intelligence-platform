import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const CustomerNavBar = () => {

  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (

    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

      <div className="text-lg font-bold">
        Customer Panel
      </div>

      <div className="flex gap-6 font-medium">

        <Link to="/" className="hover:text-cyan-400 transition">
          Home
        </Link>

        <Link to="/customer/browse-workers" className="hover:text-cyan-400 transition">
          Browse Workers
        </Link>

        <Link to="/customer/dashboard" className="hover:text-cyan-400 transition">
          Dashboard
        </Link>

      </div>

      <div className="flex items-center gap-6">

        <span className="text-sm text-gray-300">
          Welcome, {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
        >
          Logout
        </button>

      </div>

    </nav>

  );
};

export default CustomerNavBar;