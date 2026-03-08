const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register customer or worker
exports.registerUser = async (req, res) => {
  const { name, email, password, role, certifications } = req.body;

  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const isApproved = role === 'customer' ? true : false;

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    isApproved,
    certifications
  });

  return res.status(201).json({ message: 'Registration successful', user: { name: newUser.name, role: newUser.role } });
};

// Login customer or worker
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  if (user.role === 'worker' && !user.isApproved) return res.status(403).json({ message: 'Worker not approved yet' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return res.json({ token, name: user.name, role: user.role });
};

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'admin' });
  if (!user) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, name: user.name, role: user.role });
};