import express, { Application } from "express";
import { dbConnect } from "./config/db";
import router from "./router/router";

const app: Application = express();

const port = process.env.Port!;

app.use(express.json());
app.use("/api/v1/user", router);
dbConnect();

app.listen(port, () => {
  console.log("Server is connected");
});
