"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("transactions", transactionSchema);
