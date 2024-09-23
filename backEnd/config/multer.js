import multer from "multer"
import path from "path"

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Specify the folder for file uploads
  },
  filename: (req, file, cb) => {
    // Rename the file with current timestamp and the original file extension
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  }
})

// Multer Upload Function
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // You can add file type filtering logic here if needed
    // const filetypes = /xlsx|xls/ 
    const filetypes = /xlsx|xls|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel/;
// Accept only Excel files
    const mimetype = filetypes.test(file.mimetype)
    console.log("mimi", mimetype)

    if (mimetype) {
      return cb(null, true)
    } else {
      cb(
        new Error(
          "File upload only supports the following filetypes - " + filetypes
        )
      )
    }
  }
})

export default upload
