import { Request, Response } from "express";
import userModel from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";

const jwtSecret = crypto.randomBytes(64).toString("hex");
const JWT_SECRET = jwtSecret;
const API_KEY_AIRTIME = "71|Fcnxs8GFGIz8TEmHEojrl2iksCudea0bfS6Xsopk";

const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

const createReferralLink: any = (code: string) => {
  const baseUrl = "https://subsum.com";
  return `${baseUrl}/referral/${code}`;
};

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, password, referralCode } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let referral_code;
    let isUnique = false;
    while (!isUnique) {
      referral_code = generateReferralCode();
      const existingCode = await userModel.findOne({ referral_code });
      if (!existingCode) {
        isUnique = true;
      }
    }

    const referral_link = createReferralLink(referral_code);

    const signUser: any = await userModel.create({
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
      const referrer = await userModel.findOne({
        referral_code: referralCode,
      });

      if (referrer) {
        referrer!.walletBalance += 300;
        referrer.referrals.push(new mongoose.Types.ObjectId(signUser._id));
        await referrer.save();
      }
    }

    return res.status(201).json({
      message: "User created successfully",
      data: signUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

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
    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
      return res.status(404).json({
        message: "Incorrect credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Signed in successfully",
      token: token,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const fundWallet = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.walletBalance += amount;
    await user.save();

    return res.status(200).json({
      message: "Wallet funded successfully",
      walletBalance: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
