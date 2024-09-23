import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  country: String,
  state: String,
  city: { type: String },
  pincode: { type: Number },
  email: { type: String },
  mobile: { type: String, required: true },
  landline: String,
  isActive: { type: Boolean, required: true, default: true },
  contactPerson:{
    type:String
  },
  parter:{type:String},
  selected: [],
  callregistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CallRegistration"
  }
})

export default mongoose.model("Customer", CustomerSchema)
