"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.findOneUser = exports.changePassword = exports.convertAirtimeToCash = exports.fundWallet = exports.loginUser = exports.signUpUser = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
require("../config/auth");
const jwtSecret = crypto_1.default.randomBytes(64).toString("hex");
const JWT_SECRET = jwtSecret;
const AIRTIME_TO_CASH_RATE = 1.5;
const generateReferralCode = () => {
    return crypto_1.default.randomBytes(4).toString("hex");
};
const createReferralLink = (code) => {
    const baseUrl = "https://subsum.com";
    return `${baseUrl}/referral/${code}`;
};
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneNumber, password, referralCode } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        let referral_code;
        let isUnique = false;
        while (!isUnique) {
            referral_code = generateReferralCode();
            const existingCode = yield userModel_1.default.findOne({ referral_code });
            if (!existingCode) {
                isUnique = true;
            }
        }
        const referral_link = createReferralLink(referral_code);
        const signUser = yield userModel_1.default.create({
            name,
            email,
            phoneNumber,
            password: hashPassword,
            referral_code,
            referral_link,
        });
        if (!signUser) {
            return res.status(500).json({
                message: "User not created",
            });
        }
        if (referralCode) {
            const referrer = yield userModel_1.default.findOne({
                referral_code: referralCode,
            });
            if (referrer) {
                referrer.walletBalance += 300;
                referrer.current_wallet_bonus = 300;
                referrer.referrals.push(new mongoose_1.default.Types.ObjectId(signUser._id));
                yield referrer.save();
            }
        }
        return res.status(201).json({
            message: "User created successfully",
            data: signUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});
exports.signUpUser = signUpUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Incorrect credentials",
            });
        }
        // Ensure user.password is defined
        if (!user.password) {
            return res.status(500).json({
                message: "Password not found for the user",
            });
        }
        // Compare provided password with stored hash
        const comparePass = yield bcrypt_1.default.compare(password, user.password);
        if (!comparePass) {
            return res.status(404).json({
                message: "Incorrect credentials",
            });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "Signed in successfully",
            token: token,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});
exports.loginUser = loginUser;
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { amount } = req.body;
        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero",
            });
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        user.walletBalance += amount;
        yield user.save();
        return res.status(200).json({
            message: "Wallet funded successfully",
            walletBalance: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});
exports.fundWallet = fundWallet;
const convertAirtimeToCash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { airtimeAmount, network, phoneNumber, airtimeSharePin } = req.body;
        // Validate the airtime amount
        if (airtimeAmount <= 0) {
            return res.status(400).json({
                message: "Airtime amount must be greater than zero",
            });
        }
        // Validate the required fields
        if (!network || !phoneNumber || !airtimeSharePin) {
            return res.status(400).json({
                message: "Network, phone number, and airtime share pin are required",
            });
        }
        // Find the user by ID
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Calculate the cash value of the airtime
        const cashAmount = airtimeAmount * AIRTIME_TO_CASH_RATE;
        // Update the user's wallet balance
        user.walletBalance += cashAmount;
        // Save the updated user information
        yield user.save();
        return res.status(200).json({
            message: "Airtime converted to cash successfully",
            walletBalance: user.walletBalance,
            cashAmount: cashAmount,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});
exports.convertAirtimeToCash = convertAirtimeToCash;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { oldpassword, newpassword } = req.body;
        const getUser = yield userModel_1.default.findById(userId);
        if (!getUser) {
            return res.status(404).send("User not found");
        }
        const compare = yield bcrypt_1.default.compare(oldpassword, getUser.password);
        if (!compare) {
            return res.status(404).json({
                messge: "Wrong Input",
            });
        }
        const Salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(newpassword, Salt);
        getUser.password = hashPassword;
        yield getUser.save();
        return res.status(200).json({
            message: "Password Updated Successfully",
            data: getUser,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "An error occured",
            data: error.message,
        });
    }
});
exports.changePassword = changePassword;
const findOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default
            .findById(userId)
            .populate("referrals")
            .populate("transactionHistory");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User found successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "An error occured",
            data: error.message,
        });
    }
});
exports.findOneUser = findOneUser;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cloudImg = yield cloudinary_1.default.uploader.upload(req.file.path);
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).send("user not found");
        }
        user.userImage = cloudImg.secure_url;
        yield user.save;
        return res.status(200).json({
            message: "User found successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "An error occured",
            data: error.message,
        });
    }
});
exports.uploadImage = uploadImage;
