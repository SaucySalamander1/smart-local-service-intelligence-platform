import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [certifications, setCertifications] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ name, email, password, role, certifications });
      alert(data.message);

      // Only auto-login customer (optional)
      if (role === 'customer') {
        loginUser({ token: data.token || '', name, role });
        navigate('/'); // customer home
      } else {
        navigate('/'); // worker sees home, waits for admin approval
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="worker">Worker</option>
      </select>
      {role === 'worker' && (
        <input placeholder="Certifications" value={certifications} onChange={e => setCertifications(e.target.value)} />
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;