import fs from "fs"
import XLSX from "xlsx"
import Excel from "../../model/primaryUser/excelSchema.js"
import Customer from "../../model/secondaryUser/customerSchema.js"
import Product from "../../model/primaryUser/productSchema.js"
import Company from "../../model/primaryUser/companySchema.js"
import Branch from "../../model/primaryUser/branchSchema.js"
// const convertExcelToJson = (filePath) => {
//   // Read the file from the file path
//   const workbook = XLSX.readFile(filePath)
//   const sheetName = workbook.SheetNames[0]
//   const sheet = workbook.Sheets[sheetName]

//   const jsonData = XLSX.utils.sheet_to_json(sheet, {
//     raw: false, // Ensures dates are parsed as JavaScript dates
//     cellDates: true // Ensure dates are returned as Date objects
//   })

//   return jsonData.map((row) => {
//     // Iterate through each field in the row
//     Object.keys(row).forEach((key) => {
//       let value = row[key]
//       console.log("Original Value:", value, typeof value)

//       // Check if the field contains a Date object
//       if (value instanceof Date) {
//         console.log("Found a date:", value)
//         // No need to format for storage; keep as Date object
//         row[key] = value // Store as Date object
//       } else if (typeof value === "string") {
//         // Handle date strings
//         const dateFormats = [
//           { regex: /^\d{1,2}-\d{1,2}-\d{4}$/, separator: "-" }, // Format: DD-MM-YYYY
//           { regex: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, separator: "/" } // Format: DD/MM/YYYY
//         ]

//         for (const { regex, separator } of dateFormats) {
//           if (regex.test(value)) {
//             console.log("Date detected:", value)

//             // Convert to a Date object
//             const [day, month, year] = value.split(separator).map(Number)

//             // Adjust year for two-digit format
//             const fullYear =
//               year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year // Adjust for 2-digit year
//             const parsedDate = new Date(fullYear, month - 1, day) // Month is 0-based in JavaScript

//             if (!isNaN(parsedDate)) {
//               row[key] = parsedDate // Replace with Date object
//               console.log("Parsed Date:", parsedDate)
//             } else {
//               console.error("Failed to parse date:", value)
//             }
//             break // Exit loop after the first match
//           }
//         }
//       }
//     })
//     return row
//   })
// }

// const convertExcelToJson = (filePath) => {
//   // Read the file from the file path
//   const workbook = XLSX.readFile(filePath)
//   const sheetName = workbook.SheetNames[0]
//   const sheet = workbook.Sheets[sheetName]

//   const jsonData = XLSX.utils.sheet_to_json(sheet, {
//     raw: false, // Ensures dates are parsed as JavaScript dates
//     cellDates: true // Ensure dates are returned as Date objects
//   })

//   return jsonData.map((row) => {
//     // Iterate through each field in the row
//     Object.keys(row).forEach((key) => {
//       let value = row[key]
//       console.log("Original Value:", value, typeof value)

//       // Check if the field contains a Date object
//       if (value instanceof Date) {
//         console.log("Found a date:", value)
//         // No need to format for storage; keep as Date object
//         row[key] = value // Store as Date object
//       } else if (typeof value === "string") {
//         // Handle date strings
//         const dateFormats = [
//           /\d{1,2}-\d{1,2}-\d{4}/,
//           /\d{1,2}\/\d{1,2}\/\d{2,4}/
//         ]
//         for (const format of dateFormats) {
//           if (format.test(value)) {
//             console.log("Date detected:", value)
//             const parsedDate = new Date(value + "T00:00:00Z")
//             if (!isNaN(parsedDate.getTime())) {
//               row[key] = parsedDate // Replace with Date object
//               console.log("Parsed Date:", parsedDate)
//             } else {
//               console.error("Failed to parse date:", value)
//             }
//             break // Exit loop after the first match
//           }
//         }
//       }
//     })
//     return row
//   })
// }
const convertExcelToJson = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    raw: true,
    cellDates: true
  })
  return jsonData

  // return jsonData.map((row) => {
  //   Object.keys(row).forEach((key) => {
  //     let value = row[key]
  //     console.log("Original Value:", value, typeof value)

  //     // Check if the field contains a Date object
  //     if (value instanceof Date) {
  //       console.log("Found a date:", value)
  //       row[key] = value
  //     } else if (typeof value === "string") {
  //       // Handle date strings
  //       const dateFormats = [
  //         { regex: /^\d{1,2}-\d{1,2}-\d{4}$/, separator: "-" }, // DD-MM-YYYY
  //         { regex: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, separator: "/" } // DD/MM/YYYY
  //       ]

  //       for (const { regex, separator } of dateFormats) {
  //         if (regex.test(value)) {
  //           console.log("Date detected:", value)

  //           // Split the date string and create a Date object
  //           const [day, month, year] = value.split(separator).map(Number)

  //           // Adjust year for two-digit format
  //           const fullYear =
  //             year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year // Adjust for 2-digit year

  //           // Create a date in UTC to avoid time zone issues
  //           const parsedDate = new Date(Date.UTC(fullYear, month - 1, day))

  //           if (!isNaN(parsedDate.getTime())) {
  //             row[key] = parsedDate // Replace with Date object
  //             console.log("Parsed Date:", parsedDate)
  //           } else {
  //             console.error("Failed to parse date:", value)
  //           }
  //           break // Exit loop after the first match
  //         }
  //       }
  //     }
  //   })
  //   return row
  // })
}

export const ExceltoJson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.")
    }

    // Get the path from req.file
    const filePath = req.file.path

    // Convert the uploaded Excel file to JSON
    const jsonData = convertExcelToJson(filePath)
    console.log("jsnnnnnnn", jsonData)
    // Log the parsed JSON data
    const product = await Product.find()
    const company = await Company.find()
    const branch = await Branch.find()

    for (const item of jsonData) {
      const matchingProduct = product.find(
        (product) => product.productName === item["Type"]
      )
      const matchingCompany = company.find(
        (company) => company.name === "CAMET GROUP"
      )
      const matchingBranch = branch.find(
        (branch) => branch.branchName === "ACCUANET"
      )

      const selectedData = [
        {
          company_id: matchingCompany ? matchingCompany._id : null,
          companyName: matchingCompany ? matchingCompany.name : "",
          branch_id: matchingBranch ? matchingBranch._id : null,
          branchName: matchingBranch ? matchingBranch.branchName : "",
          product_id: matchingProduct ? matchingProduct._id : null,
          productName: item["Type"],
          brandName: item["S/W Type"],
          categoryName: item["User"],
          licensenumber: item["CUSTOMER ID"],
          softwareTrade: item["Software Trade"],
          noofusers: item["NoOfUser"],
          companyusing: item["CompanyUsing"],
          version: item["Version"],
          customerAddDate: item["Act On"],
          amcstartDate: item["Software HitDate"],
          amcendDate: item["Due On"],
          amcAmount: "",
          amcDescription: "",
          licenseExpiryDate: "",
          productAmount: item["Total Amount"],
          productamountDescription: "",
          tvuexpiryDate: "",
          tvuAmount: "",
          tvuamountDescription: "",
          isActive: item["Party Status"]
        }
      ]

      // Conditionally add the Wallet Id only if it exists
      if (item["Wallet Id"]) {
        selectedData.push({
          productName: "Wallet Id",
          licensenumber: item["Wallet Id"]
        })
      }

      const customerData = new Customer({
        customerName: item["Party Name"],
        address1: item["Address"],
        country: item["Country"],
        state: item["State"],
        city: item["City"],
        pincode: item["OnlineZipCode"],
        email: item["EmailID"],
        mobile: item["Mobile"],
        landline: item["Landline"],
        contactPerson: item["Contact Person"],
        selected: selectedData
      })

      await customerData.save()
    }

    res.status(200).send("File uploaded and data stored successfully!")
  } catch (error) {
    console.error("Error uploading file:", error.message)
    res.status(500).send("Error processing file.")
  }
}
// const convertExcelToJson = (filePath) => {
//   // Read the file from the file path
//   const workbook = XLSX.readFile(filePath)
//   const sheetName = workbook.SheetNames[0]
//   const sheet = workbook.Sheets[sheetName]

//   const jsonData = XLSX.utils.sheet_to_json(sheet, {
//     raw: false, // Ensures dates are parsed as JavaScript dates
//     cellDates: true // Ensure dates are returned as Date objects
//   })

//   return jsonData.map((row) => {
//     // Iterate through each field in the row
//     Object.keys(row).forEach((key) => {
//       let value = row[key]
//       console.log("Original Value:", value, typeof value)
//       if (
//         typeof value === "string" &&
//         /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(value)
//       ) {
//         console.log("datea are ", value)
//         arr.push(value)
//         console.log("arrrr", arr)
//         // Try to parse the date string into a Date object
//         const parsedDate = new Date(value)

//         if (!isNaN(parsedDate)) {
//           value = parsedDate // Replace value with the Date object
//         }
//       }
//       // Check if the field contains a Date object
//       if (value instanceof Date) {
//         console.log("hiii")
//         // Reformat the date to 'DD-MM-YYYY'
//         const formattedDate = formatDateToDDMMYYYY(value)
//         console.log("datesss", formattedDate)
//         row[key] = formattedDate // Replace with the formatted date
//       }
//     })
//     return row
//   })
// }
// const formatDateToDDMMYYYY = (date) => {
//   const day = String(date.getDate()).padStart(2, "0")

//   const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based

//   const year = date.getFullYear()
//   console.log("year", year)
//   return `${year}-${month}-${day}`
// }

// export const ExceltoJson = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.")
//     }

//     // Get the path from req.file
//     const filePath = req.file.path

//     // Convert the uploaded Excel file to JSON
//     const jsonData = convertExcelToJson(filePath)
//     // Log the parsed JSON data
//     const product = await Product.find()
//     const company = await Company.find()
//     const branch = await Branch.find()

//     for (const item of jsonData) {
//       const matchingProduct = product.find(
//         (product) => product.productName === item["Type"]
//       )
//       const matchingCompany = company.find(
//         (company) => company.name === "CAMET GROUP"
//       )
//       const matchingBranch = branch.find(
//         (branch) => branch.branchName === "ACCUANET"
//       )
//       const selectedData = [
//         {
//           company_id: matchingCompany ? matchingCompany._id : "",
//           companyName: matchingCompany ? matchingCompany.name : "",
//           branch_id: matchingBranch ? matchingBranch._id : "",
//           branchName: matchingBranch ? matchingBranch.branchName : "",
//           product_id: matchingProduct ? matchingProduct._id : "",
//           productName: item["Type"],
//           brandName: item["S/W Type"],
//           categoryName: item["User"],
//           licensenumber: item["CUSTOMER ID"],
//           softwareTrade: item["Software Trade"],
//           noofusers: item["NoOfUser"],
//           companyusing: item["CompanyUsing"],

//           version: item["Version"],
//           customerAddDate: item["Act On"],
//           amcstartDate: item["Software HitDate"],
//           amcendDate: item["Due On"],
//           amcAmount: "",
//           amcDescription: "",
//           licenseExpiryDate: "",
//           productAmount: item["Total Amount"],
//           productamountDescription: "",
//           tvuexpiryDate: "",
//           tvuAmount: "",
//           tvuamountDescription: "",
//           isActive: item["Party Status"]
//         }
//       ]

//       // Conditionally add the Wallet Id only if it exists
//       if (item["Wallet Id"]) {
//         selectedData.push({
//           productName: "Wallet Id",
//           licensenumber: item["Wallet Id"]
//         })
//       }

//       const customerData = new Customer({
//         customerName: item["Party Name"],
//         address1: item["Address"],
//         country: item["Country"],
//         state: item["State"],
//         city: item["City"],
//         pincode: item["OnlineZipCode"],
//         email: item["EmailID"],
//         mobile: item["Mobile"],
//         landline: item["Landline"],
//         contactPerson: item["Contact Person"],
//         selected: selectedData
//       })

//       await customerData.save()
//     }

//     res.status(200).send("File uploaded and data stored successfully!")
//   } catch (error) {
//     console.error("Error uploading file:", error.message)
//     res.status(500).send("Error processing file.")
//   }
// }
