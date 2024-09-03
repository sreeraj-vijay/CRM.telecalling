import React, { useState, useEffect } from "react"
import api from "../../api/api"

const ProductList = () => {
  const [tab, settab] = useState("brand")
  const [items, setItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/inventory/getproductsubDetails?tab=${tab}&page=${currentPage}&limit=10`
        )
        setItems(response.data.data)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Failed to fetch data", error)
      }
    }

    fetchData()
  }, [tab, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{tab} List</h1>
      <ul className="bg-white shadow-md rounded-lg p-4">
        {items.map((item) => (
          <li key={item._id} className="border-b border-gray-200 py-2">
            {item[tab]}
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pages.map((page) => (
          <li
            key={page}
            className={`mx-1 ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-md`}
          >
            <button
              className="px-3 py-1 focus:outline-none focus:ring"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ProductList
