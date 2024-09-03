import React from "react"
import CustomerAdd from "../../../components/secondaryUser/CustomerAdd"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../../api/api"
import { toast } from "react-toastify"

function CustomerEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const customerId = location.state?.customer
  const handleSubmit = async (customerData) => {
    try {
      const response = await api.post(
        `/customer/customerEdit?customerid=${customerId}`,
        customerData,
        {
          withCredentials: true
        }
      )
      toast.success(response.data.message)
      navigate("/admin/masters/customer")
    } catch (error) {
      console.error("Error updating branch:", error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <CustomerAdd process="edit" handleCustomerData={handleSubmit} />
    </div>
  )
}

export default CustomerEdit
