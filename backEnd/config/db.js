import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB is connected ${connect.connection.host}`)

    }catch(error){
        console.log(`Mongo Connection failed ${error.message}`)
        process.exit(1)
    }
}
export default connectDB