import express from 'express';
import dotenv from "dotenv"
import connectDB from './config/db.js';
import cors from "cors"
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import primaryUsers from './routes/primaryUserRoute.js';
// import secondaryUsers from './routes/secondaryUserRoute.js';
import path from 'path'
dotenv.config()

// Running port configuration
const PORT = process.env.PORT || 7000;

// MongoDB connection getting from config/db.js
connectDB()
const corsOptions = {
  // origin: ['http://localhost:5173', 'https://erp.camet.in'],
  // origin:'https://erp.camet.in',
  origin:true,
  credentials: true,
};

const app = express();

// Middleware
app.use(express.json({ limit: '100mb', parameterLimit: 50000 }));
app.use(express.urlencoded({ limit: '100mb', extended: true , parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '100mb', parameterLimit: 50000 }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true , parameterLimit: 50000 }));
app.use(cors(corsOptions));
app.use(cookieParser());


// Routes
// app.use("/api/pUsers", primaryUsers);
// app.use("/api/sUsers", secondaryUsers);

if(process.env.NODE_ENV==="production"){
  console.log(process.env.NODE_ENV);
  console.log("hai")
  const __dirname=path.resolve()
  const parentDir = path.join(__dirname ,'..'); 
  // const parentDir = path.join(__dirname ,); 
  console.log(parentDir)
  app.use(express.static(path.join(parentDir,'/frondEnd/dist')))
  app.get('*',(req,res)=>res.sendFile(path.resolve(parentDir,'frondEnd','dist','index.html')))
}else{
app.get('/',(req,res)=>{
    res.send("Server is Ready")
})
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

