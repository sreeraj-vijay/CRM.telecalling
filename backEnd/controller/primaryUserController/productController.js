import Product from "../../model/primaryUser/productSchema.js"
import mongoose from "mongoose"
export const ProductRegistration = async (req, res) => {
  const {
    productData,
    tableData
    // company,
    // branches,
    // productName,
    // productPrice,
    // brand,
    // category,
    // hsn,
    // description,
  } = req.body
  console.log("productData:", productData)
  console.log("table Data:", tableData)

  // Check if user already exists

  const productExists = await Product.findOne({
    productName: productData.productName
  })

  if (productExists) {
    return res
      .status(400)
      .json({ message: "Product with this name already exists in the branch" })
  }

  try {
    // Create and save new user
    const products = new Product({
      selected: tableData,
      productName: productData.productName,
      productPrice: productData.productPrice,
      brand: productData.brand,
      category: productData.category,
      hsn: productData.hsn,
      description: productData.description
    })
    await products.save()
    res.status(200).json({
      status: true,
      message: "Products created successfully"
    })
  } catch (error) {
    res.status(500).json({ message: "server error" })
  }
}

// export const ProductRegistration = async (req, res) => {
//   const formData = req.body
//   const tab = Object.keys(formData)[0]
//   const value = formData[tab]
//   console.log("values of formData", value)

//   let data
//   switch (tab) {
//     case "brand":
//       data = {
//         model: Brand,
//         field: "brand",
//       }
//       break
//     case "category":
//       data = {
//         model: Category,
//         field: "category",
//       }
//       break
//     default:
//       return res.status(400).json({ message: "Invalid tab provided" })
//   }

//   // Check if item already exists
//   const existingItem = await data.model.findOne({ [data.field]: value })
//   if (existingItem) {
//     return res.status(400).json({ message: `${tab} is already registered` })
//   }

//   try {
//     // Create and save new item
//     const collection = new data.model({
//       [data.field]: value,
//     })
//     console.log("collection:", collection)
//     await collection.save()

//     res.status(200).json({
//       status: true,
//       message: `${tab} created successfully`,
//       data: collection,
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Server error" })
//   }
// }
// export const GetproductsubDetails = async (req, res) => {
//   const { tab, page = 1, limit = 10 } = req.query

//   let model
//   switch (tab) {
//     case "brand":
//       model = Brand
//       break
//     case "category":
//       model = Category
//       break
//     default:
//       return res.status(400).json({ message: "Invalid tab provided" })
//   }

//   try {
//     const skip = (page - 1) * limit // Calculate how many items to skip
//     const items = await model.find().skip(skip).limit(parseInt(limit)) // Fetch the items

//     if (!items || items.length === 0) {
//       return res.status(404).json({
//         message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s not found`,
//       })
//     }

//     const totalItems = await model.countDocuments() // Get total number of documents
//     const totalPages = Math.ceil(totalItems / limit) // Calculate total number of pages

//     res.status(200).json({
//       message: `${tab.charAt(0).toUpperCase() + tab.slice(1)}s found`,
//       data: items,
//       totalItems, // Total number of items
//       totalPages, // Total number of pages
//       currentPage: parseInt(page), // Current page number
//     })
//   } catch (error) {
//     console.error(error.message)
//     res.status(500).json({ message: "Server error", error })
//   }
// }

export const GetallProducts = async (req, res) => {
  try {
    const products = await Product.find()

    if (!products && products.length < 0) {
      res.status(404).json({ messsge: "products not found" })
    }
    res.status(200).json({ message: "productsfound", data: products })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}

export const GetProducts = async (req, res) => {
  try {
    const {
      productid,
      companyid,
      branchid,
      brandid,
      categoryid,
      hsnid,
      brandName,
      categoryName,
      hsnName
    } = req.query

    // Step 1: Find the product by productId
    if (productid) {
      const product = await Product.findById(productid)

      if (product) {
        const selected = product.selected || []

        // Get thce `selected` field from the product

        // Initialize query object based on provided parameters
        const query = {}
        if (companyid) query.company_id = companyid
        if (branchid) query.branch_id = branchid
        if (brandid) query.brand_id = brandid
        if (categoryid) query.category_id = categoryid
        if (hsnid) query.hsn_id = hsnid
        if (brandName) query.brand_name = brandName
        if (categoryName) query.category_name = categoryName
        if (hsnName) query.hsn_name = hsnName

        // Check if the selected field contains a match for the given criteria
        const matchingItems = selected.filter((item) => {
          return Object.keys(query).every((key) => item[key] === query[key])
        })

        if (matchingItems.length > 0) {
          const response = {
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            description: product.description,

            selected: matchingItems.length > 0 ? matchingItems : [] // Include only matching items or an empty array
          }

          // Return the entire product data including matching items in the `selected` field
          res.status(200).json({ data: [response] })
        } else {
          // Return the entire product data with an empty `selected` field if no matches
          res.status(200).json({
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            description: product.description,
            GSTIN: product.GSTIN,
            selected: [] // Empty array if no matches
          })
        }
      } else {
        res.status(404).json({ message: "Product not found" })
      }
    } else {
      res.status(400).json({ message: "Product ID is required" })
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ message: "Server error fetching product" })
  }
}

export const UpdateProductDetails = async (req, res) => {
  const { id, tab } = req.query

  const updateData = req.body
  let model
  switch (tab) {
    case "brand":
      model = Brand
      break
    case "category":
      model = Category
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }

  try {
    const updatedProductSubDetails = await model.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!updatedProductSubDetails) {
      return res.status(404).json({ message: "Product sub-details not found" })
    }

    res.status(200).json({ data: updatedProductSubDetails })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const DeleteproductDetails = async (req, res) => {
  const { id, tab } = req.query
  let model
  switch (tab) {
    case "brand":
      model = Brand
      break
    case "category":
      model = Category
      break
    default:
      return res.status(400).json({ message: "Invalid tab provided" })
  }
  try {
    // Perform the deletion
    const result = await model.findByIdAndDelete(id)

    if (result) {
      return res.status(200).json({ message: `${tab} deleted successfully` })
    } else {
      return res.status(404).json({ message: `${tab} not found` })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
//function used to create hsn
export const CreateHsn = async (req, res) => {
  const { hsnSac, description, onValue, onItem } = req.body.hsnData

  const owner = req.owner.userId
  try {
    const hsnAlreadyExists = await Hsn.findOne({ hsnSac, owner })
    if (hsnAlreadyExists) {
      return res.status(400).json({ message: "Hsn already exists" })
    }
    const newHsn = new Hsn({ owner, hsnSac, description, onValue, onItem })
    const HsnData = await newHsn.save()
    console.log("now created:", HsnData)
    return res
      .status(201)
      .json({ success: false, message: "Hsn created successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error creating hsn", error })
  }
}
//function used to get hsn
export const GetHsnDetails = async (req, res) => {
  try {
    const hsnData = await Hsn.find({ owner: req.owner.userId }).populate(
      "owner"
    )
    res
      .status(200)
      .json({ message: "Branches fetched successfully", data: hsnData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// function used to update hsn
export const UpdateHsn = async (req, res) => {
  const { _id, hsnSac, description, onValue, onItem } = req.body.hsnData
  const ownerId = req.owner?.userId

  try {
    // Check if another user already has this description
    const nameAlreadyExists = await HsnModel.findOne({
      hsnSac,
      owner: { $ne: ownerId }
    })

    if (nameAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Hsn already exists"
      })
    } else {
      // Update the user type
      const updateHsn = await HsnModel.updateOne(
        { _id, owner: ownerId },
        {
          hsnSac: hsnSac,
          description: description,
          onValue: onValue,
          onItem: onItem
        }
      )

      if (!updateHsn) {
        return res.status(404).json({
          success: false,
          message: "Hsn update failed"
        })
      }

      return res.status(200).json({
        success: true,
        message: "Hsn updated successfully"
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Error updating Hsn",
      error: error.message
    })
  }
}

//function used to delete HSN

export const DeleteHsn = async (req, res) => {
  try {
    const { id } = req.query
    console.log(id)
    const deletedHsn = await Hsn.findByIdAndDelete({ _id: id })
    if (!deletedHsn) {
      return res
        .status(404)
        .json({ success: false, message: "Hsn is not found" })
    }
    return res
      .status(200)
      .json({ success: true, message: "Hsn deleted successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error deleting Hsn",
      error: error.message
    })
  }
}
