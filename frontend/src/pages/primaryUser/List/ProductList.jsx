import React, { useEffect, useState } from "react"
import ProductListform from "../../../components/primaryUser/ProductListform"
import UseFetch from "../../../hooks/useFetch"
import toast from "react-hot-toast"
function ProductList() {
  const [products, setProducts] = useState([])
  const {
    data: productData,
    loading,
    error,
  } = UseFetch("/product/getallProducts")

  useEffect(() => {
    if (productData) {
      // Set the data to the state when it is fetched
      setProducts(productData)
    }
  }, [productData])
  console.log("products in backend :", products)
  useEffect(() => {
    if (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }, [error])

  return (
    <div>
      <ProductListform productlist={products} />
    </div>
  )
}

export default ProductList
