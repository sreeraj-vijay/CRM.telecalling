import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema } = mongoose

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    mobileno: {
      type: String,
      required: [true, "Mobile number is required"],
      match: /^[0-9]{10}$/, // Example for a 10-digit Indian number
    },

    password: {
      type: String,

      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Staff", "Admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Other staff-specific fields
  },
  { timestamps: true }
)

const adminSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },

    mobileno: {
      type: String,

      match: /^[0-9]{10}$/, // Example for a 10-digit Indian number
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Staff", "Admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Other admin-specific fields
  },
  { timestamps: true }
)

// Pre-save hook for password hashing
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

export default {
  Staff: mongoose.model("Staff", staffSchema),
  Admin: mongoose.model("Admin", adminSchema),
}
