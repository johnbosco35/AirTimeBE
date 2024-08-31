import multer from "multer";
import { Request } from "express";

type DestinationCallBack = (Error: Error | null, Destination: string) => void;
type FileDesCallBack = (Error: Error | null, Destination: string) => void;

// Define storage for user images
const userImageStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallBack
  ) => {
    cb(null, "uploads/users");
  },

  filename: (req: Request, file: Express.Multer.File, cb: FileDesCallBack) => {
    cb(null, file.originalname);
  },
});

const userImageUpload = multer({
  storage: userImageStorage,
  limits: { fieldSize: 1024 * 1024 },
}).single("userImage");

export { userImageUpload };
