const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/*
REGISTER USER
Customer -> auto approved
Worker -> needs admin approval
*/
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password, role, certifications } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      certifications,
      isApproved: role === "customer"
    })

    res.status(201).json({
      message: "Registration successful"
    })

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: "Server error" })

  }

}


/*
LOGIN USER (customer or worker)
*/
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    if (user.role === "worker" && !user.isApproved) {
      return res.status(403).json({ message: "Worker not approved yet" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      name: user.name,
      role: user.role
    })

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: "Server error" })

  }

}


/*
ADMIN LOGIN
*/
exports.adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email, role: "admin" })

    if (!user) {
      return res.status(404).json({ message: "Admin not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      name: user.name,
      role: user.role
    })

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: "Server error" })

  }

}