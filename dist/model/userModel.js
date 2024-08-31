"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+234\d{10}$/;
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        // required: true,
    },
    accountStatus: {
        type: String,
        enum: ["Active", "InActive"],
    },
    phoneNumber: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [emailRegex, "Please input a valid email"],
    },
    referral_link: {
        type: String,
    },
    referral_code: {
        type: String,
        unique: true,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    current_wallet_bonus: {
        type: Number,
        default: 0,
    },
    googleId: {
        type: String,
        // required: true,
    },
    userImage: {
        type: String,
    },
    referrals: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    transactionHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "transactions",
        },
    ],
});
exports.default = (0, mongoose_1.model)("Users", userSchema);
