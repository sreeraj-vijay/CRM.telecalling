import fs from "fs"
import XLSX from "xlsx"
import Excel from "../../model/primaryUser/excelSchema.js"
import Customer from "../../model/secondaryUser/customerSchema.js"

const convertExcelToJson = (filePath) => {
  // Read the file from the file path
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  console.log("sheet", sheet)
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    raw: false, // Ensures dates are parsed as JavaScript dates
    cellDates: true // Ensure dates are returned as Date objects
  })
  // Format dates in the required format: DD-MM-YYYY
  return jsonData.map((row) => {
    // Iterate through each field in the row
    Object.keys(row).forEach((key) => {
      let value = row[key]
      console.log("Original Value:", value, typeof value)
      if (
        typeof value === "string" &&
        /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(value)
      ) {
        // Try to parse the date string into a Date object
        const parsedDate = new Date(value)
        if (!isNaN(parsedDate)) {
          value = parsedDate // Replace value with the Date object
        }
      }
      // Check if the field contains a Date object
      if (value instanceof Date) {
        // Reformat the date to 'DD-MM-YYYY'
        const formattedDate = formatDateToDDMMYYYY(value)
        row[key] = formattedDate // Replace with the formatted date
      }
    })
    return row
  })
}
const formatDateToDDMMYYYY = (date) => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export const ExceltoJson = async (req, res) => {
  try {
    console.log("fileobject", req.file) // Check the file object

    if (!req.file) {
      return res.status(400).send("No file uploaded.")
    }

    // Get the path from req.file
    const filePath = req.file.path
    console.log("File path:", filePath) // Log the file path

    // Convert the uploaded Excel file to JSON
    const jsonData = convertExcelToJson(filePath)
    console.log("JSON Datass:", jsonData) // Log the parsed JSON data

    for (const item of jsonData) {
      const selectedData = [
        {
          company_id: "",
          companyName: "CRM",
          branch_id: "",
          branchName: "",
          product_id: "",
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
          product_name: "Wallet Id",
          license_no: item["Wallet Id"]
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
