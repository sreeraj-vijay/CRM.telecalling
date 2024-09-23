import Branch from "../../model/primaryUser/branchSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
export const BranchRegister = async (req, res) => {
  const { branchName, email, company } = req.body

  // Check if user already exists
  // const branchExists = await Branch.findOne({ email })
  const branchExists = await Branch.findOne({
    $or: [
      { email: email }, // Condition 1: Match a document with the same email
      { branchName: branchName }, // Condition 2: Match a document with the same branch name
    ],
  })
  if (branchExists) {
    return res.status(400).json({ message: "Branch already exist" })
  }

  try {
    // Create and save new user
    const branches = new Branch({
      company,
      email,
      branchName,
    })
    console.log("control branch:", branches)
    const savedBranch = await branches.save()
    await Company.findByIdAndUpdate(
      company,
      { $push: { branches: savedBranch._id } },
      { new: true }
    )
    res.status(200).json({
      status: true,
      message: "Branch created successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server errorsssss" })
  }
}
export const Getbranch = async (req, res) => {
  try {
    const branches = await Branch.find().populate({
      path: "company",
      model: "Company",
      select: "name",
    })
    console.log("branchdata :", branches)
    if (!branches && branches.length < 0) {
      res.status(404).json({ messsge: "company not found" })
    }
    res.status(200).json({ message: "branch found", data: branches })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}
export const UpdateBranch = async (req, res) => {
  const data = req.body
  const ownerId = req.body.owner
  const id = req.body._id

  try {
    const updatedBranch = await Branch.updateOne(
      { _id: id, owner: ownerId },
      {
        name: data.name,
        address: data.ownerId,
        city: data.city,
        pincode: data.pincode,
        country: data.country,
        state: data.state,
        email: data.email,
        mailserver: data.mailserver,
        mobile: data.mobile,
        website: data.website,
        pan: data.pan,
        landlineno: data.landlineno,
        gstin: data.gstin,
        accountDetails: data.accountDetails,
        terms: data.terms,
        parcelServices: data.parcelServices,
      }
    )

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updatedCompany,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Error updating branch",
      error: error.message,
    })
  }
}
