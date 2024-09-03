import React from "react"
import UserAdd from "../../../components/primaryUser/UserAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function UserRegistration() {
  const navigate = useNavigate()
  const handleSubmit = async (userData) => {
    try {
      const response = await api.post("/auth/userRegistration", userData, {
        withCredentials: true,
      })
      toast.success("Company created successfully:")
      navigate("/admin/home")
    } catch (error) {
      console.error("Error creating company:", error)
    }
  }
  return (
    <div>
      <UserAdd process="Registration" handleUserData={handleSubmit} />
    </div>
  )
}

export default UserRegistration
