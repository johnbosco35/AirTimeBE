import dotenv from "dotenv";

dotenv.config();

export const environmentVariables = {
  CLIENT_URI: process.env.CLIENT_URI,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};
