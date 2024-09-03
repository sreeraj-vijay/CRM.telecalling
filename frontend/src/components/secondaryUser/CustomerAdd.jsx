import React, { useEffect, useState, useMemo } from "react"
import Select, { components } from "react-select"
import { useForm } from "react-hook-form"
import UseFetch from "../../hooks/useFetch"
import useDebounce from "../../hooks/useDebounce"
import { toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
const CustomerAdd = ({ process, handleCustomerData, handleEditedData }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm()

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [companyData, setCompanyData] = useState([])
  const [branchData, setBranchData] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [tableData, setTableData] = useState([])
  const [editState, seteditState] = useState(false)
  const [licenseAvailable, setLicenseAvailable] = useState(true)
  const [editIndex, setEditIndex] = useState(null)
  const [license, setLicense] = useState([])

  const [isLicense, setlicenseExist] = useState([])
  const [products, setProducts] = useState([])
  const [tableObject, setTableObject] = useState({
    company_id: "",
    company_name: "",
    branch_id: "",
    branch_name: "",
    product_id: "",
    product_name: "",
    license_no: "",
    no_of_users: "",
    version: "",
    customer_addDate: "",
    amc_startDate: "",
    amc_endDate: "",
    amc_amount: "",
    amc_description: "",
    license_expiryDate: "",
    product_amount: "",
    product_description: "",
    tvu_expiryDate: "",
    tvu_amount: "",
    tvu_description: ""
  })
  //now created
  const [isChecking, setIsChecking] = useState(false)
  const { data: productData, error: productError } = UseFetch(
    "/product/getallProducts"
  )
  const { data: licensenumber, error: licensenumberError } = UseFetch(
    "/customer/getLicensenumber"
  )
  // Debounce license number input
  useEffect(() => {
    if (licensenumber) {
      setLicense(licensenumber)
    }
  })
  console.log(license)
  const debouncedLicenseNo = useDebounce(tableObject.license_no, 500)
  useEffect(() => {
    // If there's a debounced license number, check its uniqueness
    if (debouncedLicenseNo) {
      if (license.length > 0 && isLicense.length === 0) {
        const checkLicense = license.find(
          (item) => item.license_no === debouncedLicenseNo
        )
        if (checkLicense) {
          setLicenseAvailable(false)
          console.log("checked true at license")

          toast.error("license number already exits")
        } else {
          setLicenseAvailable(true)
          console.log("checked false at licesnes")
          toast.success("license number is available")
        }
      } else {
        if (isLicense.length > 0) {
          console.log("is", isLicense)
          const checklicense = isLicense.find(
            (item) => item === debouncedLicenseNo
          )
          const licensecheck = license.find(
            (item) => item.license_no === debouncedLicenseNo
          )
          if (checklicense || licensecheck) {
            setLicenseAvailable(false)
            console.log("checked false at islicense")

            toast.error("license number is already exist")
          } else {
            setLicenseAvailable(true)
            console.log("checked false at islicense")
            toast.success("license number is available")
          }
        } else {
          setLicenseAvailable(true)
          toast.success("license number is available")
        }
      }
    }

    // checkLicenseNumber(debouncedLicenseNo)
  }, [debouncedLicenseNo])

  

  useEffect(() => {
    if (productData) setProducts(productData) // Directly set products to productData
  }, [productData])

  const handleTableData = () => {
    if (!licenseAvailable) {
      toast.error("license number is already exists")
      return
    }
    if (tableObject.company_id.trim() === "") {
      toast.error("please select a company")
      return
    } else if (tableObject.branch_id.trim() === "") {
      toast.error("please select a branch")
      return
    } else if (tableObject.product_id.trim() === "") {
      toast.error("please select a product")
      return
    } else if (tableObject.license_no.trim() === "") {
      toast.error("please add a license number")
      return
    } else if (tableObject.no_of_users.trim() === "") {
      toast.error("please add users")
      return
    } else if (tableObject.version.trim() === "") {
      toast.error("please add version")
      return
    } else if (tableObject.customer_addDate.trim() === "") {
      toast.error("please choose a date")
      return
    } else if (tableObject.amc_startDate.trim() === "") {
      toast.error("please add amc start date")
      return
    } else if (tableObject.amc_amount.trim() === "") {
      toast.error("please select amc end date")
      return
    } else if (tableObject.amc_amount.trim() === "") {
      toast.error("please fill amc amount")
      return
    } else if (tableObject.amc_description.trim() === "") {
      toast.error("please add amc description")
      return
    } else if (tableObject.license_expiryDate.trim() === "") {
      toast.error("please add license expiryDate")
      return
    } else if (tableObject.product_amount.trim() === "") {
      toast.error("please add product amount")
      return
    } else if (tableObject.product_description.trim() === "") {
      toast.error("please add product description")
      return
    } else if (tableObject.tvu_expiryDate.trim() === "") {
      toast.error("please add tvu expiryDate")
      return
    } else if (tableObject.tvu_amount.trim() === "") {
      toast.error("please add tvu amount")
      return
    } else if (tableObject.tvu_description.trim() === "") {
      toast.error("please add tvu description")
      return
    }

    if (editIndex !== null) {
      // If in edit mode, update the existing item
      setTableData((prev) => {
        const newData = [...prev]
        newData[editIndex] = tableObject // Update the specific item
        return newData
      })
      setEditIndex(null)
      seteditState(false) // Reset the edit index
    } else {
      // Otherwise, add a new item
      const isIncluded = tableData.some(
        (item) => JSON.stringify(item) === JSON.stringify(tableObject)
      )

      if (isIncluded) {
        toast.error("already added")
        return
      }

      setTableData((prev) => [...prev, tableObject])

      setlicenseExist((prev) => [...prev, tableObject.license_no])
    }

    // reset()
  }

  useEffect(() => {
    if (productError) {
      toast.error(
        productError?.response?.data?.message || "Something went wrong!"
      )
    }
  }, [productError])

  const handleDelete = (id) => {
    const filtereddData = tableData.filter((product, index) => {
      return index !== id
    })

    setTableData(filtereddData)
    reset()
  }
  const handleEdit = (id) => {
    seteditState(true) // Close the edit state (or handle according to your logic)

    const itemToEdit = tableData.find((item) => item.product_id === id) // Find the product to edit

    if (itemToEdit) {
      // Set the form values
      const fieldsToSet = {
        productName: itemToEdit.product_name,
        companyName: itemToEdit.company_name,
        branchName: itemToEdit.branch_name,
        productAmount: itemToEdit.product_amount,
        tvuamountDescription: itemToEdit.tvu_description,

        licensenumber: itemToEdit.license_no,
        noofuser: itemToEdit.no_of_users,
        version: itemToEdit.version,
        customerAddDate: itemToEdit.customer_addDate,
        amcstartDate: itemToEdit.amc_startDate,
        amcendDate: itemToEdit.amc_endDate,
        amcAmount: itemToEdit.amc_amount,
        amcDescription: itemToEdit.amc_description,
        licenseExpiryDate: itemToEdit.license_expiryDate,
        productamountDescription: itemToEdit.product_description,
        tvuexpiryDate: itemToEdit.tvu_expiryDate,
        tvuAmount: itemToEdit.tvu_amount,
        tuvamountDescription: itemToEdit.tvu_description
      }

      // Set form values using setValue
      Object.entries(fieldsToSet).forEach(([key, value]) =>
        setValue(key, value)
      )

      // Find index of the item being edited and set it to the state
      const index = tableData.findIndex((item) => item.product_id === id)
      setEditIndex(index)
    }
  }

  const handleProductChange = (selectedOption) => {
    const productId = selectedOption.value
    const productName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      product_id: productId,
      product_name: productName
    }))

    setSelectedProduct(productId)

    setValue("product", productId) // Update the value in react-hook-form
  }

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption.value
    const companyName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      company_id: companyId,
      company_name: companyName
    }))
    setValue("company", selectedOption?.value || "")
    setSelectedCompany(selectedOption.value)
  }
  ///now created

  const handleBranchChange = (selectedOption) => {
    const branchId = selectedOption.value
    const branchName = selectedOption.label

    setTableObject((prev) => ({
      ...prev,
      branch_id: branchId,
      branch_name: branchName
    }))
    setValue("branch", selectedOption?.value || "")
    setSelectedBranch(true)
  }

  const productOptions = useMemo(() => {
    return products?.map((product) => ({
      value: product._id,
      label: product.productName
    }))
  }, [products])
  //now created
  const filteredCompanies = useMemo(() => {
    const product = products.find((product) => product._id === selectedProduct)
    if (product) {
      // Using a Set to track unique company IDs
      const uniqueCompanyIds = new Set()
      const uniqueCompanies = product.selected
        .filter((item) => {
          if (!uniqueCompanyIds.has(item.company_id)) {
            uniqueCompanyIds.add(item.company_id)
            return true // Include this item in the filtered array
          }
          return false // Skip this item as it has a duplicate company_id
        })
        .map((item) => ({
          _id: item.company_id,
          name: item.company_name
        }))
      return uniqueCompanies
    }
    return []
  }, [products, selectedProduct])

  // Mapping filtered companies to options for a dropdown
  const companyOptions = useMemo(() => {
    return filteredCompanies.map((company) => ({
      value: company._id,
      label: company.name
    }))
  }, [filteredCompanies])

  //now created
  const filteredBranches = useMemo(() => {
    if (!selectedCompany) return [] // No branches if no company is selected
    const product = products.find((product) => product._id === selectedProduct)
    if (product) {
      return product.selected
        .filter((item) => item.company_id === selectedCompany)
        .map((item) => ({
          _id: item.branch_id,
          name: item.branch_name
        }))
    }
    return []
  }, [products, selectedProduct, selectedCompany])
  //now created
  const branchOptions = useMemo(() => {
    return filteredBranches.map((branch) => ({
      value: branch._id,
      label: branch.name
    }))
  }, [filteredBranches])

  // const com = (apanyOptions = useMemo(() => {}))

  // const selectedProductData = useMemo(
  //   () => products?.find((product) => product._id === selectedProduct?.value),
  //   [productData?.products, selectedProduct]
  // )
  

  const onSubmit = async (formData) => {
    try {
      if (!licenseAvailable) {
        toast.error("license number is already exists")
        return
      }
      if (process === "Registration") {
        await handleCustomerData(formData, tableData)
        reset()
      } else if (process === "Edit") {
        await handleEditedData(formData)
      }
      toast.success("Customer saved successfully!")
    } catch (error) {
      toast.error("Failed to save customer!")
    }
  }

  return (
    <div className="container justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="w-auto bg-white shadow-lg rounded p-8 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Customer Master</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 m-5">
            {/* Product Select Dropdown */}

            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                {...register("customerName", {
                  required: "Customer name is required"
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none"
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.customerName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address 1
              </label>
              <input
                type="text"
                {...register("address1")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Address"
              />
              {errors.address1 && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.address1.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address 2
              </label>
              <input
                type="text"
                {...register("address2")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm outline-none focus:border-gray-500"
                placeholder="Address"
              />
              {errors.address2 && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.address2.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register("country")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Country"
              />
              {errors.country && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.country.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                {...register("state")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="State"
              />
              {errors.state && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.state.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register("city")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="City"
              />
              {errors.city && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                {...register("pincode")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Pincode"
              />
              {errors.pincode && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.pincode.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Email"
              />
              {errors.email && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                {...register("mobile", { required: "mobile is required" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Phone"
              />
              {errors.mobile && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.mobile.message}
                </span>
              )}
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Landline No
              </label>
              <input
                type="tel"
                {...register("landline")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                placeholder="Landline"
              />
              {errors.landline && (
                <span className="mt-2 text-sm text-red-600">
                  {errors.landline.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-6">Product Details</h1>
            <div className="  grid grid-cols-1 sm:grid-cols-4 gap-6 m-5">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Product
                </label>
                <Select
                  id="productName"
                  options={productOptions}
                  onChange={handleProductChange}
                  className=""
                  placeholder="Select a product..."
                />
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Company
                </label>
                <Select
                  id="companyName"
                  options={companyOptions}
                  onChange={handleCompanyChange}
                  className=""
                  placeholder="Select a product..."
                />
              </div>
              {/* Branch Display */}
              <div>
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Associated Branch
                </label>
                <Select
                  id="branchName"
                  options={branchOptions}
                  onChange={handleBranchChange}
                  className=""
                  placeholder="Select a product..."
                />
              </div>
              <div>
                <label
                  htmlFor="licensenumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  License
                </label>
                <input
                  id="licensenumber"
                  type="text"
                  {...register("licensenumber")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        license_no: e.target.value
                      }) // Update state on change
                  }
                  className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="License No..."
                />
                {errors.licensenumber && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.licensenumber.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="noofusers"
                  className="block text-sm font-medium text-gray-700"
                >
                  No.of Users
                </label>
                <input
                  type="number"
                  {...register("noofuser")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        no_of_users: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="No of users.."
                />
                {errors.noofuser && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.noofuser.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="version"
                  className="block text-sm font-medium text-gray-700"
                >
                  Version
                </label>
                <input
                  id="version"
                  type="text"
                  {...register("version")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        version: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Version..."
                />
                {errors.version && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.version.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerAddDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Add Date
                </label>
                <input
                  id="customerAddDate"
                  type="date"
                  {...register("customerAddDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        customer_addDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.customerAddDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.customerAddDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcstartDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Start Date
                </label>
                <input
                  id="amcstartDate"
                  type="date"
                  {...register("amcstartDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amc_startDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.amcstartDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcstartDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcendDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC End Date
                </label>
                <input
                  id="amcendDate"
                  type="date"
                  {...register("amcendDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amc_endDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.amcendDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcendDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="amcAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Amount
                </label>
                <input
                  type="number"
                  {...register("amcAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amc_amount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Amc amount.."
                />
                {errors.amcAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.amcAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  id="amcDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  AMC Description
                </label>
                <textarea
                  id="amcDescription"
                  rows="1"
                  {...register("amcDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        amc_description: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.productDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.productDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="licenseExpiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Expiry Date
                </label>
                <input
                  id="licenseExpiryDate"
                  type="date"
                  {...register("licenseExpiryDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        license_expiryDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.licenseExpiryDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.licenseExpiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="productAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Amount
                </label>
                <input
                  type="number"
                  // value={selectedProduct.}
                  {...register("productAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        product_amount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Product amount.."
                />
                {errors.productAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.productAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="productamountDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Description
                </label>
                <textarea
                  id="productamountDescription"
                  rows="1"
                  {...register("productamountDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        product_description: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.productamountDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.productamountDescription.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="tvuexpiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  TVU ExpiryDate
                </label>
                <input
                  id="tvuexpiryDate"
                  type="date"
                  {...register("tvuexpiryDate")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvu_expiryDate: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                />
                {errors.tvuexpiryDate && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuexpiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="tvuAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  TVU Amount
                </label>
                <input
                  id="tvuAmount"
                  type="number"
                  {...register("tvuAmount")}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvu_amount: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Tvu amount.."
                />
                {errors.tvuAmount && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuAmount.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  id="tvuamountDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tvu Description
                </label>
                <textarea
                  id="tvuamountDescription"
                  rows="1"
                  {...register("tvuamountDescription", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters"
                    }
                  })}
                  onChange={
                    (e) =>
                      setTableObject({
                        ...tableObject,
                        tvu_description: e.target.value
                      }) // Update state on change
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm focus:border-gray-500 outline-none"
                  placeholder="Enter a description..."
                />
                {errors.tvuamountDescription && (
                  <span className="mt-2 text-sm text-red-600">
                    {errors.tvuamountDescription.message}
                  </span>
                )}
              </div>
            </div>
            {selectedBranch && (
              <div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleTableData}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    {editState ? "UPDATE" : "ADD"}
                  </button>
                </div>
                <div className="mt-2">
                  <label>
                    <input
                      type="radio"
                      value="true"
                      {...register("isActive", { required: true })}
                    />
                    Active
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="false"
                      {...register("isActive", { required: true })}
                    />
                    Inactive
                  </label>
                  {errors.isActive && (
                    <p>Please select a status for the customer.</p>
                  )}
                </div>
                <div className="mt-6 w-lg overflow-x-auto">
                  <h3 className="text-lg font-medium text-gray-900">
                    Product Details List
                  </h3>
                  <table className="bg-green-300 m-w-full divide-y divide-gray-200 mt-4">
                    <thead>
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
                          Customer addDate
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.company_name}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.branch_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.license_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.no_of_users}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.version}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.customer_addDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amc_startDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amc_endDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.amc_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.license_expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.product_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvu_expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.tvu_amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {" "}
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-900 mr-2" // Adjust styles as needed
                              // onClick={() => handleEdit(index)}
                            >
                              <FaEdit
                                onClick={() => handleEdit(product.product_id)}
                              />
                            </button>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaTrash onClick={() => handleDelete(index)} />
                            </button>

                            {/* Add delete button */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* tabledata */}

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {process === "Registration" ? "Save" : "Update "}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAdd
