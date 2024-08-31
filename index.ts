import express, { Application } from "express";
import { dbConnect } from "./config/db";
import router from "./router/router";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app: Application = express();

const port = process.env.Port!;

// const swaggerDocs = YAML.load(
//   //   path.join(__dirname, "..", "..", "docs", "documentation.yaml")
//   path.join(__dirname, "..", "docs", "documentation.yaml")
// );

// Swagger UI route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use("/api/v1/user", router);
dbConnect();

app.listen(port, () => {
  console.log("Server is connected");
});
