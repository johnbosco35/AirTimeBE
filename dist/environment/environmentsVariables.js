"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environmentVariables = {
    CLIENT_URI: process.env.CLIENT_URI,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
};
