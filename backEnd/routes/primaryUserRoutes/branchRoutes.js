import express from "express"
import {
  BranchRegister,
  Getbranch,
} from "../../controller/primaryUserController/branchController.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/branchRegistration", authMiddleware, BranchRegister)
router.get("/getBranch", authMiddleware, Getbranch)

export default router
