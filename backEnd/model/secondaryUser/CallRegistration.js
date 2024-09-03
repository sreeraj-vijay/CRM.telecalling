import mongoose from "mongoose"

const CallRegistrationSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  customerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  callregistration: []
})

export default mongoose.model("CallRegistration", CallRegistrationSchema)
