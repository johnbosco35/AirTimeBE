"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../config/db");
const router_1 = __importDefault(require("../router/router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const swagger_1 = require("../config/swagger");
const app = (0, express_1.default)();
const port = process.env.Port;
app.use((0, express_session_1.default)({
    secret: "your_secret_key", // Replace with your own secret
    resave: false,
    saveUninitialized: true,
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Use routes
app.use(express_1.default.json());
app.use("/api/v1/user", router_1.default);
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
app.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/profile");
});
app.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/google");
    }
    return res.status(200).json({
        message: "Google sign success",
        data: req.user,
    });
});
(0, db_1.dbConnect)();
app.listen(port, () => {
    console.log("Server is connected");
});
