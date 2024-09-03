import React from "react"
import BrandAdd from "../../../components/primaryUser/BrandAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function BranchEdit() {
  const navigate = useNavigate()
  const handleSubmit = async (branchData) => {
    try {
      const response = await api.post("/companyEdit", branchData, {
        withCredentials: true,
      })
      toast.success("Branch updated successfully:")
      navigate("/admin/masters/company")
    } catch (error) {
      console.error("Error updating branch:", error)
    }
  }
  return (
    <div>
      <BrandAdd process="edit" handleBranchData={handleSubmit} />
    </div>
  )
}

export default BranchEdit
