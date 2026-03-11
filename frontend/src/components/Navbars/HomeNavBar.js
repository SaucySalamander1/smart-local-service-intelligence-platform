import { Link } from "react-router-dom";

const HomeNavbar = () => {
  return (

    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">

      <div className="text-xl font-bold">
        Local Service Center
      </div>

      <div className="flex gap-6 font-medium">

        <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
        <Link to="/services" className="hover:text-cyan-400 transition">Services</Link>
        <Link to="/become-worker" className="hover:text-cyan-400 transition">Become Worker</Link>
        <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
        <Link to="/about" className="hover:text-cyan-400 transition">About</Link>

        <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
        <Link to="/register" className="hover:text-cyan-400 transition">Register</Link>
        <Link to="/admin/login" className="hover:text-red-400 transition">Admin</Link>

      </div>

    </nav>

  );
};

export default HomeNavbar;