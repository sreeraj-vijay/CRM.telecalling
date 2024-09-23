import express from "express"
import {
  CompanyRegister,
  Getcompany,
} from "../../controller/primaryUserController/companyController.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/companyRegistration", authMiddleware,CompanyRegister)
router.get("/getCompany", Getcompany)

export default router
