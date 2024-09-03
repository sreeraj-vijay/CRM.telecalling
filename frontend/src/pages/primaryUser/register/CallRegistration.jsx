import React, { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import api from "../../../api/api"

import debounce from "lodash.debounce"
import UseFetch from "../../../hooks/useFetch"

export default function CallRegistration() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors }
  } = useForm()

  const [customerData, setCustomerData] = useState([])
  const [productDetails, setProductDetails] = useState([])
  const [user, setUser] = useState(null)
  const [searching, setSearching] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false) // Start with the timer running
  const [startTime, setStartTime] = useState(Date.now())
  const [endTime, setEndTime] = useState(null)
  const [formData, setFormData] = useState(null)
  const [callData, setCallData] = useState({
    startTime: "",
    endTime: "",
    duration: "",
    token: ""
  })
  // const { data: userData, error: userError } = UseFetch("//getallProducts")
  //timer for page loading
  const [tokenData, settokenData] = useState(null)

  useEffect(() => {
    if (selectedCustomer) {
      setIsRunning(true)
      setStartTime(Date.now())
    } else {
      setIsRunning(false)
      setTime(0) // Reset the timer when no customer is selected
    }
  }, [selectedCustomer])

  useEffect(() => {
    let interval = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, startTime])

  // useEffect(() => {
  // //   if (callData.token && callData.startTime) {
  // //     ;(async () => {
  // //       const response = await api.post(
  // //         `/customer/callRegistration?customerid=${selectedCustomer._id}`,
  // //         { callData }, // You might need to include form data if necessary
  // //         {
  // //           withCredentials: true
  // //         }
  // //       )
  // //       reset() // Reset form after submission
  // //       // Handle response if needed
  // //     })()
  // //   }
  // // }, [tokenData, callData])

  const storedUser = localStorage.getItem("user")
  const parsedUser = storedUser ? JSON.parse(storedUser) : {}
  const userOptions = [
    {
      value: parsedUser._id,
      label: parsedUser.name
    }
  ]

  function generateUniqueNumericToken(length = 10) {
    const timestamp = Math.floor(Date.now() / 1000) // Current time in seconds
    const randomPart = Math.floor(Math.random() * 10 ** (length - 6)) // Random number with remaining digits
    const token = `${timestamp % 10 ** 6}${randomPart
      .toString()
      .padStart(length - 6, "0")}` // Ensure length

    return token
  }

  // const uniqueToken = generateUniqueNumericToken()
  // console.log(uniqueToken) // Example: '52879605'

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`
  }

  // const stopTimer = () => {
  //   setIsRunning(false)
  //   localStorage.setItem("timer", time) // Save timer value in local storage
  // }
  const stopTimer = async () => {
    setIsRunning(false)
    setEndTime(Date.now()) // Set the end time
    localStorage.setItem("timer", time)
    const userid = local
    // Save timer value in local storage
    const uniqueToken = generateUniqueNumericToken()

    const data = {
      startTime: formatDateTime(new Date(startTime)),
      endTime: formatDateTime(new Date(Date.now())),
      duration: formatTime(time),
      token: uniqueToken
    }

    return data
  }

  const formatDateTime = (date) => {
    const year = date.getFullYear()
    const month = date.toLocaleString("default", { month: "long" })
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const fetchCustomerData = debounce(async (query) => {
    const url = `http://localhost:5000/api/customer/getCustomer?search=${encodeURIComponent(
      query
    )}`

    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const result = await response.json()
        setCustomerData(result.data) // Store the customer data directly
      } else {
        const errorData = await response.json()
        console.error("Error fetching customer data:", errorData.message)
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message)
    } finally {
      setSearching(false)
    }
  }, 300)

  const handleInputChange = (inputValue) => {
    setSearch(inputValue)
    if (inputValue.length > 0) {
      fetchCustomerData(inputValue)
    } else {
      setCustomerData([])
    }
  }

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer)

    setProductDetails(customer.selected)
    setSearching(true)

    // Additional actions can be performed here (e.g., populate form fields)
  }
  const onSubmit = async (data) => {
    const datas = await stopTimer()
    const calldata = {
      call: datas,
      formdata: data
    }
    console.log("calldatain before:", calldata)
    const response = await api.post(
      `/customer/callRegistration?customerid=${selectedCustomer._id}&userid=${userid}`,
      calldata, // You might need to include form data if necessary
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json" // Ensure the correct content type
        }
      }
    )
  }

  return (
    <div className="container  justify-center items-center p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded min-h-screen p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Call Registration</h2>
        <hr className="border-t-2 border-gray-300 mb-4"></hr>
        <div className="w-2/4 ml-5">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Search Customer
            </label>
            <input
              type="text"
              id="productName"
              value={search}
              onChange={(e) => handleInputChange(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
              placeholder="Enter name or license..."
            />
          </div>
        </div>

        {searching ? (
          ""
        ) : (
          <div className="ml-5 w-2/4 max-h-40 overflow-y-auto overflow-x-auto  mt-4 border border-gray-200 shadow-md rounded-lg">
            {/* Wrap the table in a div with border */}
            <table className="min-w-full bg-white">
              <thead className="sticky top-0 z-30 bg-green-300 border-b border-green-300 shadow">
                {/* Add a bottom border to the <thead> */}
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    License No
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mobile No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerData?.map((customer, index) =>
                  customer.selected.map((item, subIndex) => (
                    <tr
                      key={`${index}-${subIndex}`} // Ensure unique key for each row
                      onClick={() => handleRowClick(customer)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {customer?.customerName}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {item?.license_no}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {customer?.mobile}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedCustomer && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 m-5 bg-[#4888b9] shadow-md rounded p-5">
              <div className="">
                <h4 className="text-md font-bold text-white">Customer Name</h4>
                <p className="text-white">{selectedCustomer.customerName}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Email</h4>
                <p className="text-white">{selectedCustomer.email}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Mobile</h4>
                <p className="text-white">{selectedCustomer.mobile}</p>
              </div>
              <div className=" ">
                <h4 className="text-md font-bold text-white">Address 1</h4>
                <p className="text-white">{selectedCustomer.address1}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Address 2</h4>
                <p className="text-white">{selectedCustomer.address2}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">City</h4>
                <p className="text-white">{selectedCustomer.city}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">State</h4>
                <p className="text-white">{selectedCustomer.state}</p>
              </div>
              <div className=" ">
                <h4 className="text-md font-bold text-white">Country</h4>
                <p className="text-white">{selectedCustomer.country}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Pincode</h4>
                <p className="text-white">{selectedCustomer.pincode}</p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Landline</h4>
                <p className="text-white">
                  {selectedCustomer.landline || "N/A"}
                </p>
              </div>
              <div className="">
                <h4 className="text-md font-bold text-white">Status</h4>
                <p
                  className={` ${
                    selectedCustomer.isActive
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedCustomer.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <div className="mt-6 w-lg ">
              <div className="mb-2 ml-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Product Details List
                </h3>
              </div>

              <div className="m-5 w-lg max-h-40 overflow-x-auto overflow-y-auto">
                <table className=" m-w-full divide-y divide-gray-200 shadow">
                  <thead className="sticky  top-0 z-30 bg-green-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No.of Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Installed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amc startDate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amc endDate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amc amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Amount
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tvu expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tvu amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productDetails?.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.product_name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.company_name}
                        </td>

                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.branch_name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.license_no}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.no_of_users}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.version}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.customer_addDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.amc_startDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.amc_endDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.amc_amount}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.license_expiryDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.product_amount}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.tvu_expiryDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product?.tvu_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className=" container mt-12 ">
                <div className="flex container justify-center items-center">
                  <p className="text-2xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    Call Duration: {formatTime(time)}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Updated parent div with justify-between */}
                  <div className="flex justify-between m-5">
                    <div className="w-1/3 ">
                      {" "}
                      {/* Adjust width and padding for spacing */}
                      <label
                        htmlFor="customerName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Incoming Number
                      </label>
                      <input
                        type="Number"
                        id="incomingNumber"
                        {...register("incomingNumber", {
                          required: "Incoming number is required"
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                        placeholder="Enter Incoming Number"
                      />
                      {errors.incomingNumber && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.incomingNumber.message}
                        </span>
                      )}
                    </div>
                    <div className="w-1/3">
                      {" "}
                      {/* Adjust width and padding for spacing */}
                      <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Token
                      </label>
                      <input
                        type="text"
                        id="token"
                        {...register("token", {})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between m-5">
                    <div className="w-1/3">
                      <label
                        id="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="1"
                        {...register("description", {
                          maxLength: {
                            value: 500,
                            message: "Description cannot exceed 500 characters"
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                        placeholder="Enter a description..."
                      />
                      {errors.description && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.description.message}
                        </span>
                      )}
                    </div>
                    <div className="w-1/3">
                      <label
                        id="solution"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Solution
                      </label>
                      <textarea
                        id="solution"
                        rows="1"
                        {...register("solution", {
                          maxLength: {
                            value: 500,
                            message: "Solution cannot exceed 500 characters"
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                        placeholder="Enter a solution..."
                      />
                      {errors.solution && (
                        <span className="mt-2 text-sm text-red-600">
                          {errors.solution.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between m-5">
                    <div className="w-1/3">
                      <label
                        htmlFor="completedby"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Completed By
                      </label>
                      <select
                        {...register("completedby")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                      >
                        <option value="">-- Select user--</option>
                        {userOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/3">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        {...register("status")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                      >
                        <option value="">-- Select status--</option>
                        <option value="pending">Pending</option>
                        <option value="solved">Solved</option>
                      </select>
                    </div>
                  </div>
                  {isRunning && (
                    <div className=" flex justify-center items-center">
                      <button
                        type="submit"
                        className="px-4 py-2 font-medium text-white bg-gradient-to-r from-red-500 to-red-700 rounded-md shadow-md hover:shadow-lg focus:outline-none transition-shadow duration-200"
                      >
                        End Call
                      </button>
                    </div>
                  )}
                </form>

                <div className="mt-12 overflow-y-auto w-full max-h-50">
                  <table className=" w-full divide-y divide-gray-200 rounded-lg ">
                    <thead className="sticky top-0 z-30 bg-blue-200 shadow">
                      <tr className="">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Solution
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AttendedBy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CompletedBy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* {callData?.map((call, index) => (
                        <tr
                          key={index}
                          className={`border ${
                            call.status === "solved"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        >
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {tokenData.token}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.startTime}
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.endTime}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.duration}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.startTime}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.endTime}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.startTime}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.duration}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {call?.endTime}
                          </td>
                        </tr>
                      ))} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
