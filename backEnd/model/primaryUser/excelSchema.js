import mongoose from "mongoose"

const ExcelSchema = new mongoose.Schema({
  data: []
  
})

export default mongoose.model("Excel", ExcelSchema)
