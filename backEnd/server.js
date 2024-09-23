import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import companyRoutes from "./routes/primaryUserRoutes/companyRoutes.js"
import branchRoutes from "./routes/primaryUserRoutes/branchRoutes.js"
import inventoryRoutes from "./routes/primaryUserRoutes/inventoryRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import excelRoutes from "./routes/primaryUserRoutes/excelRoutes.js"
import secondaryUserRoutes from "./routes/secondaryUserRoutes/secondaryUserRoutes.js"
import productRoutes from "./routes/primaryUserRoutes/productRoutes.js"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

// Running port configuration
const PORT = process.env.PORT || 7000

// MongoDB connection getting from config/db.js
connectDB()

// const corsOptions = {
//   // origin: ['http://localhost:5173', 'https://erp.camet.in'],
//   // origin:'https://erp.camet.in',
//   origin: true,
//   credentials: true
// }

const app = express()

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")))

// Middleware
app.use(express.json({ limit: "100mb", parameterLimit: 50000 }))
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
)
app.use(bodyParser.json({ limit: "100mb", parameterLimit: 50000 }))
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000
  })
)
// app.use(cors(corsOptions))
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true
  })
)
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/excel", excelRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/branch", branchRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/customer", secondaryUserRoutes)

//   console.log(process.env.NODE_ENV) // if (process.env.NODE_ENV === "production") {
//   console.log("Serving static files from production build")
//   app.use(express.static(path.join(__dirname, "frondEnd", "dist")))
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frondEnd", "dist", "index.html"))
//   )
// } else {
//   app.get("/", (req, res) => {
//     res.send("Server is Ready")
//   })
// }

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

if (process.env.NODE_ENV === "production") {
  console.log(process.env.NODE_ENV)
  console.log("hai")
  const __dirname = path.resolve()
  //  const parentDir = path.join(__dirname ,'..');
  const parentDir = path.join(__dirname, "..")
  console.log(parentDir)
  app.use(express.static(path.join(parentDir, "/frontend/dist")))
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(parentDir, "frontend", "dist", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("Server is Ready")
  })
}
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
