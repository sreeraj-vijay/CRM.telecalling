import Customer from "../../model/secondaryUser/customerSchema.js"
import License from "../../model/secondaryUser/licenseSchema.js"
import CallRegistration from "../../model/secondaryUser/CallRegistration.js"

export const CustomerRegister = async (req, res) => {
  const { customerData, tabledata = {} } = req.body

  const {
    customerName,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
    email,
    mobile,
    landline
  } = customerData

  // Check if user already exists
  const customerExists = await Customer.findOne({ customerName })

  if (customerExists) {
    return res.status(400).json({ message: "Customer already registered" })
  }

  try {
    const customer = new Customer({
      customerName,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      email,
      mobile,
      landline,
      selected: tabledata
    })
    const customerData = await customer.save()

    if (tabledata) {
      for (const item of customerData.selected) {
        const license = new License({
          products: item.product_id,
          customerName: customerData._id, // Using the customer ID from the parent object
          license_no: item.license_no
        })

        await license.save()
      }
    }

    res.status(200).json({
      status: true,
      message: "Customer created successfully"
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "server error" })
  }
}
export const GetCustomer = async (req, res) => {
  const { search } = req.query

  try {
    let searchCriteria = {}

    if (!isNaN(search)) {
      // Search by license number or mobile number using partial match
      const searchRegex = new RegExp(`^${search}`, "i")

      searchCriteria = {
        $or: [{ "selected.license_no": searchRegex }, { mobile: searchRegex }]
      }
    } else {
      // Search by customer name
      searchCriteria = { customerName: new RegExp(search, "i") }
    }

    let customers = await Customer.find(searchCriteria)

    if (customers.length === 0) {
      res.json({ message: "No customer found" })
    } else {
      res.json({ message: "Customer(s) found", data: customers })
    }
  } catch (error) {
    console.error("Error fetching customer data:", error.message)
    res
      .status(500)
      .json({ message: "An error occurred while fetching customer data." })
  }
}

// export const GetCustomer = async (req, res) => {
//   const { search } = req.query
//   console.log("search parameter in controller:", search)

//   try {
//     // Search by license number, customer name, or mobile number
//     let searchCriteria = {}

//     if (!isNaN(search)) {
//       // Search by license number
//       searchCriteria = { "selected.license_no": search }
//     } else {
//       // Search by customer name
//       searchCriteria = { customerName: new RegExp(search, "i") }
//     }

//     let customers = await Customer.find(searchCriteria)
//     console.log("Initial search result:", customers)

//     if (customers.length === 0) {
//       // If no results, try searching by mobile number
//       searchCriteria = { mobile: search }
//       console.log("serachhhhhhhhhaadada:", searchCriteria)
//       customers = await Customer.find(searchCriteria)
//       console.log("Search by mobile result:", customers)
//     }

//     if (customers.length > 0) {
//       res.json({ message: "Customer(s) found", data: customers })
//     } else {
//       res.json({ message: "No customer found" })
//     }
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message)
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching customer data." })
//   }
// }

// export const GetCustomer = async (req, res) => {
//   const { search } = req.query

//   const searchCriteria = {}

//   // Check if search is a number (could be license number)
//   if (!isNaN(search)) {
//     searchCriteria["selected.license_no"] = search
//   } else {
//     // Assume search is a customer name otherwise
//     searchCriteria.customerName = new RegExp(search, "i") // 'i' for case insensitive
//   }

//   try {
//     // First search by license number or customer name

//     let customers = await Customer.find(searchCriteria)
//     console.log("cust:", customers)

//     // If no results are found, search by mobile number
//     if (customers.length == 0) {
//       console.log("serarhhh", search)
//       searchCriteria = { mobile: search }
//       customers = await Customer.find(searchCriteria)
//     }

//     // Send response once with all found customers (if any)
//     if (customers.length > 0) {
//       res.json({ message: "Customer(s) found", data: customers })
//     } else {
//       res.json({ message: "No customer found" })
//     }
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message)
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching customer data." })
//   }
// }

// export const checkLicenseNumber = async (req, res) => {
//   const { license_no } = req.body
//   console.log("license check at:", license_no)

//   try {
//     // Query the Customer collection to find if the license number exists in any product
//     const customer = await Customer.findOne({
//       "selected.license_no": license_no
//     })

//     // Return a response indicating whether the license number exists
//     if (customer) {
//       return res.status(200).json({ exists: true })
//     } else {
//       return res.status(200).json({ exists: false })
//     }
//   } catch (error) {
//     console.error("Error checking license number:", error)
//     return res.status(500).json({ message: "Internal Server Error" })
//   }
// }

// export const GetCustomer = async (req, res) => {
//   try {
//     const customers = await Customer.find()
//     console.log("customers list:", customers)

//     if (!customers && customers.length < 0) {
//       res.status(404).json({ messsge: "customers not found" })
//     }
//     res.status(200).json({ message: "customers found", data: customers })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server Error")
//   }
// }
// export const GetCustomer = async (req, res) => {
//   const { search } = req.query

//   console.log("search parameter in controller:", search)

//   const searchCriteria = {}

//   if (!isNaN(search)) {
//     searchCriteria["selected.license_no"] = search
//   }
//   // Assume search is a customer name otherwise
//   else {
//     searchCriteria.customerName = new RegExp(search, "i") // 'i' for case insensitive
//   }

//   try {
//     const customers = await Customer.find(searchCriteria)
//     console.log("cust:", customers)
//     if (customers.length == 0) {
//       searchCriteria.mobile = search
//       const customer = await Customer.find(searchCriteria)
//       console.log("customedddddddd:", customer)
//       if (customer) {
//         res.json({ message: "customer found ", data: customer })
//       }
//     }
//     res.json({ message: "customer found", data: customers })
//   } catch (error) {
//     console.error("Error fetching customer data:", error.message)
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching customer data." })
//   }
// }

export const GetLicense = async (req, res) => {
  try {
    const licensenumber = await License.find()
    console.log("license number:", licensenumber)
    if (licensenumber.length > 0) {
      res
        .status(200)
        .json({ message: "license number found", data: licensenumber })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
}
export const customerCallRegistration = async (req, res) => {
  const calldata = req.body
  const { customerid } = req.query
  console.log("new customerid:", customerid)
  console.log("body:", req.body)
  console.log("new calldata", calldata)
  // console.log("tokendata", tokenData)
  // console.log("calldata", callData)
  // console.log("data", formData)
  // console.log("idddddd:", customerid)
  const user = await CallRegistration.findById(customerid)
  console.log("new user,", user)
  if (!user) {
    const users = new CallRegistration({
      callregistration: calldata,

      customerid
    })
    console.log("usersssss", user)
  }
  try {
  } catch (error) {}
}
