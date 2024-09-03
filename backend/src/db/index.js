import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      "DB CONNECTED SUCCESSFULLY !! HOST:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MONGODB CONNECTION ERRROR :", error);
    throw error;
    // process.exit(1); //exiting the process which is currently running
  }
};

export default dbConnect;
