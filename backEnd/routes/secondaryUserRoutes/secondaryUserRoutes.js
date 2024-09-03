import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  CustomerRegister,
  GetCustomer,
  GetLicense,
  customerCallRegistration
} from "../../controller/secondaryUserController/customerController.js"

const router = express.Router()

router.post("/customerRegistration", authMiddleware, CustomerRegister)
// router.post("/customerEdit")
router.get("/getLicensenumber", authMiddleware, GetLicense)
router.get("/getCustomer", authMiddleware, GetCustomer)
router.post("/callRegistration", customerCallRegistration)

export default router
