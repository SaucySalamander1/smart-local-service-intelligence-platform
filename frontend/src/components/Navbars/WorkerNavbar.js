// src/components/NavBars/WorkerNavBar.js
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const WorkerNavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#ffd699' }}>
      <Link to="/">Home</Link>
      <Link to="/worker/dashboard">Dashboard</Link>
      <Link to="/worker/services">My Services</Link>
      <span>Welcome, {user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default WorkerNavBar;