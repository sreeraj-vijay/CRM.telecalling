import express from "express"
import authMiddleware from "../../middleware/authMiddleware.js"
import {
  CustomerRegister,
  GetCustomer,
  GetLicense,
  customerCallRegistration,
  GetCallRegister,
  GetallCalls
} from "../../controller/secondaryUserController/customerController.js"

const router = express.Router()

router.post("/customerRegistration", authMiddleware, CustomerRegister)
// router.post("/customerEdit")
router.get("/getLicensenumber", authMiddleware, GetLicense)
router.get("/getCustomer", authMiddleware, GetCustomer)
router.post("/callRegistration", authMiddleware, customerCallRegistration)
router.get("/getcallregister/:callId", GetCallRegister)
router.get("/getcallregister/", GetCallRegister)
router.get("/getallcalls", authMiddleware, GetallCalls)

export default router
