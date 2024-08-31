import express, { Application } from "express";
import { dbConnect } from "../config/db";
import router from "../router/router";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import passport from "passport";
import session from "express-session";
import { swaggerSpec } from "../config/swagger";

const app: Application = express();

const port = process.env.Port!;

app.use(
  session({
    secret: "your_secret_key", // Replace with your own secret
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes

app.use(express.json());
app.use("/api/v1/user", router);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/google");
  }
  return res.status(200).json({
    message: "Google sign success",
    data: req.user,
  });
});

dbConnect();

app.listen(port, () => {
  console.log("Server is connected");
});
