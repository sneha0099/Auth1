import mongoose from "mongoose";

const ConnectDB = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log('DB connected');
    } catch (error) {
        console.log("Error while connecting to DB: ",error); 
        process.exit(1);
    }
    
}

export default ConnectDB;
