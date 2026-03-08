// src/components/NavBars/AdminNavBar.js
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminNavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#ff9999' }}>
      <Link to="/">Home</Link>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/workers">Manage Workers</Link>
      <Link to="/admin/customers">Manage Customers</Link>
      <span>Welcome, {user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default AdminNavBar;