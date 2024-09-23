import express from "express"

import {
  Login,
  Register,
  GetallUsers,
  LeaveApply,
  GetallLeave
} from "../controller/authController.js"
const router = express.Router()

router.post("/login", Login)
router.post("/register", Register)
router.post("/userRegistration", Register)
router.get("/getallUsers", GetallUsers)
router.post("/leave", LeaveApply)
router.get("/getallLeave", GetallLeave)

export default router
