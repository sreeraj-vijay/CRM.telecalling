import models from "../model/auth/authSchema.js"
const { Staff, Admin } = models
import bcrypt from "bcrypt"

import generateToken from "../utils/generateToken.js"
export const Register = async (req, res) => {
  const { name, email, mobileno, password, role } = req.body
  console.log("role of :", role)
  if (role === "Admin") {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      try {
        // Create and save new user
        const admin = new Admin({
          name,
          email,
          mobileno,
          password, // This will be hashed by the pre-save middleware
          role
        })
        await admin.save()
        res.status(200).json({
          status: true,
          message: "admin created successfully"
        })
      } catch (error) {
        res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" })
    }
  } else if (role === "Staff") {
    const staff = await Staff.findOne({ email })
    if (!staff) {
      try {
        // Create and save new user
        const staff = new Staff({
          name,
          email,
          mobileno,
          password, // This will be hashed by the pre-save middleware
          role
        })
        await staff.save()
        res.status(200).json({
          status: true,
          message: "staff created successfully"
        })
      } catch (error) {
        res.status(500).json({ message: "Server error" })
      }
    } else {
      return res
        .status(409)
        .json({ message: "staff with this email already exists" })
    }
  }
}

export const Login = async (req, res) => {
  const { email, password, role } = req.body

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    let user
    if (role === "Admin") {
      user = await Admin.findOne({ email })
    } else if (role === "Staff") {
      user = await Staff.findOne({ email })
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials" })
    }

    const token = generateToken(res, user.id)

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role, user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
