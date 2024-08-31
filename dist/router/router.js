"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const swagger_1 = require("../config/swagger");
const router = express_1.default.Router();
// Serve Swagger UI
router.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
/**
 * @swagger
 * /createuser:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               referralCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/createuser", userController_1.signUpUser);
/**
 * @swagger
 * /fund-wallet/{userId}:
 *   patch:
 *     summary: Fund a user's wallet
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/fund-wallet/:userId", userController_1.fundWallet);
/**
 * @swagger
 * /loginuser:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found or incorrect credentials
 *       500:
 *         description: Server error
 */
router.post("/loginuser", userController_1.loginUser);
/**
 * @swagger
 * /one_user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/one_user/:userId", userController_1.findOneUser);
/**
 * @swagger
 * /change_password/{userId}:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldpassword:
 *                 type: string
 *               newpassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: User not found or wrong input
 *       500:
 *         description: Server error
 */
router.patch("/change_password/:userId", userController_1.changePassword);
/**
 * @swagger
 * /convert_airtime_to_cash/{userId}:
 *   post:
 *     summary: Convert airtime to cash
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               airtimeAmount:
 *                 type: number
 *               network:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               airtimeSharePin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Airtime converted to cash successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/convert_airtime_to_cash/:userId", userController_1.convertAirtimeToCash);
/**
 * @swagger
 * /upload_image/{userId}:
 *   patch:
 *     summary: Upload user image
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user for whom the image is being uploaded
 *         schema:
 *           type: string
 *       - in: formData
 *         name: file
 *         required: true
 *         description: Image file to upload
 *         schema:
 *           type: file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User image updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userImage:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred"
 */
router.patch("/upload_image/:userId", userController_1.uploadImage);
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirects to profile page after successful authentication
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google sign success"
 *                 data:
 *                   type: object
 *                   description: User profile data
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     picture:
 *                       type: string
 *                       format: uri
 *       302:
 *         description: Redirects to Google login page if not authenticated
 *       500:
 *         description: Server error
 */
exports.default = router;
