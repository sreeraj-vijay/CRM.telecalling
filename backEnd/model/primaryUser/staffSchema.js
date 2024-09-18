import mongoose from "mongoose" // Define the user schema
const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // Removes any extra spaces from input
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      trim: true,
      lowercase: true, // Converts email to lowercase
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please use a valid email address."
      ] // Email validation
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits."] // Ensures it's 10 digits
    },
    password: {
      type: String,
      required: true,
      minlength: 6 // Password should be at least 6 characters
    },
    verified: {
      type: Boolean,
      default: true // Initially set to true, but admin can change it
    },
    dob: {
      type: Date
    },
    bloodgroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not a valid blood group"
      }
    },
    gender: {
      type: String
    },
    address: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String
    },
    pincode: {
      type: Number
    },
    joiningdate: {
      type: Date
    },
    designation: {
      type: String
    }
  },
  {
    timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
  }
)
export default mongoose.model("Staff", staffSchema)
