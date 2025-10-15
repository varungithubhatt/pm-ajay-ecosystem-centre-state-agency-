import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRoutes from "./routes/user.routes.js"
import  schemeRoutes from "./routes/scheme.routes.js"
import fundRoutes from "./routes/funds.routes.js"
import reportRoutes from "./routes/report.routes.js"
import villageRoutes from "./routes/village.routes.js"
import funds_routes from "./routes/village-funds.js"
import Progress_routes from "./routes/progressReports.js"
import { fileURLToPath } from "url";
import path from "path";




dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(userRoutes);
app.use(schemeRoutes);
app.use(fundRoutes);
app.use(reportRoutes);
app.use(villageRoutes);
app.use(funds_routes);
app.use("/api/progress",Progress_routes);
 app.use(express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));




const PORT = process.env.PORT || 7000 ;


const start=async()=>{

     const mongodb=await mongoose.connect(process.env.MONGO_URI)
     console.log("mongodb is connected")
 app.listen(PORT,()=>{
    console.log("server is running on port",PORT)
 })

  

}
start();
