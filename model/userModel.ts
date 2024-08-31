import mongoose, { model, Schema, Document } from "mongoose";

export interface user extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  accountStatus: "Active" | "InActive";
  referral_link: string;
  referral_code: string;
  userImage: string;
  password: string;
  walletBalance: number;
  current_wallet_bonus: number;
  referrals: {}[];
  transactionHistory: {}[];
  googleId: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+234\d{10}$/;

const userSchema = new Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  transactionHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transactions",
    },
  ],
});

export default model<user>("Users", userSchema);
