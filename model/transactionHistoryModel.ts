import mongoose, { model, Schema, Document } from "mongoose";

interface transact extends Document {
  service: string;
  amount: number;
  totalAmount: number;
  status: "Failed" | "Initiated" | "Successful";
  paymentMethod: "Transfer" | "Wallet" | "Card Payment";
  TransactionNumber: number;
}

const transactionSchema = new Schema<transact>({
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Failed", "Initiated", "Successful"],
  },
  paymentMethod: {
    type: String,
    enum: ["Transfer", "Wallet", "Card Payment"],
  },
  amount: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  TransactionNumber: {
    type: Number,
    unique: true,
  },
});

export default model<transact>("transactions", transactionSchema);
