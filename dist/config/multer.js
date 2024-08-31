"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userImageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
// Define storage for user images
const userImageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/users");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const userImageUpload = (0, multer_1.default)({
    storage: userImageStorage,
    limits: { fieldSize: 1024 * 1024 },
}).single("userImage");
exports.userImageUpload = userImageUpload;
