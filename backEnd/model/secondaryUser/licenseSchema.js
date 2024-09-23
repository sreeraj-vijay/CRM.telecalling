import mongoose from "mongoose"

const LicenseSchema = new mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  license_no: { type: String, required: true }
})

export default mongoose.model("License", LicenseSchema)
