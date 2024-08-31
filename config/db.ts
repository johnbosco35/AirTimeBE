import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MongoDB_URL! as any;

export const dbConnect = async () => {
  try {
    await mongoose
      .connect(uri)
      .then(() => {
        console.log("Successfully connected to db");
      })
      .catch((error) => {
        console.log("An error occured", error);
      });
  } catch (error) {
    console.log(error);
  }
};
