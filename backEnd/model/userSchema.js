import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  branch: { type: String, required },
  name: { type: String, required: true },
  code: { type: number, required: true },
  contactperson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: number, required: true },
  landline: { type: number, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  address: {
    addressline1: { type: String, required: true },
    addressline2: { type: String },
    addressline3: { type: String },
    addressline4: { type: String },
  },
  partner: { type: String, required: true },
  softwaretrade: { type: String, required: true },
  executive: { type: String, required: true },
  stauts: { type: String, enum: ["active", "inactive"], required: true },
})

export default mongoose.model("User", userSchema)
