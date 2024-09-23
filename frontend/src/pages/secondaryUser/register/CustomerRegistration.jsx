import React from "react"
import CustomerAdd from "../../../components/secondaryUser/CustomerAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function CustomerRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async (customerData, tabledata) => {
    try {
      const response = await api.post(
        "/customer/customerRegistration",
        { customerData, tabledata },
        {
          withCredentials: true
        }
      )
      toast.success(response.data.message)
      navigate("/admin/masters/customer")
    } catch (error) {
      console.error("Error creating company:", error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <CustomerAdd process="Registration" handleCustomerData={handleSubmit} />
    </div>
  )
}

export default CustomerRegistration
