// src/components/NavBars/CustomerNavBar.js
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CustomerNavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#cceeff' }}>
      <Link to="/">Home</Link>
      <Link to="/customer/dashboard">Dashboard</Link>
      <span>Welcome, {user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default CustomerNavBar;