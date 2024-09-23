import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import upload from "../../config/multer.js"
import { ExceltoJson } from "../../controller/primaryUserController/excelController.js"

const router = express.Router()

router.post("/uploadExcel",upload.single('file'), ExceltoJson)

export default router
