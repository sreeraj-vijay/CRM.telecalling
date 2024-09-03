import React, { useEffect, useState } from "react"

import { useLocation } from "react-router-dom"
import UseFetch from "../../../hooks/useFetch"
import ProductAdd from "../../../components/primaryUser/ProductAdd"
import api from "../../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
function ProductEdit() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { productData } = location.state
  console.log("proddddddd", productData)

  const handleSubmit = async (productData) => {
    try {
      const response = await api.post("/product/productEdit", productData, {
        withCredentials: true,
      })
      toast.success("Company updated successfully:")
      navigate("/admin/masters/product")
    } catch (error) {
      console.error("Error updating company:", error)
    }
  }
  return (
    <div>
      <ProductAdd
        process="edit"
        handleProductData={handleSubmit}
        productData={productData}
      />
    </div>
  )
}

export default ProductEdit
