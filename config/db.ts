import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1/airtimeDb";

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
