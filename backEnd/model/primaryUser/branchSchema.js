import mongoose from "mongoose"

const BranchSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  branchName: { type: String, required: true },
  branchCode: Number,
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  phone: String,
  email: String,
})

export default mongoose.model("Branch", BranchSchema)
