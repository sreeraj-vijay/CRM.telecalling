// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   productName: { type: String, required: true },
//   selected: [],
//   productPrice: { type: Number, required: true },
//   description: { type: String },
//   GSTIN: String,
//   companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // Assuming there is a Company model
//   branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Assuming there is a Branch model
//   brandName: { type: String },
//   categoryName: { type: String },
//   hsnName: { type: String },
// });

// export default mongoose.model("Product", productSchema);

import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  description: { type: String },

  selected: [],
  GSTIN: String
})

export default mongoose.model("Product", productSchema)
