import { Router } from "express";
import {
  changePassword,
  convertAirtimeToCash,
  findOneUser,
  fundWallet,
  loginUser,
  signUpUser,
  uploadImage,
} from "../controller/userController";

const router = Router();

router.post("/createuser", signUpUser);
router.patch("/fund-wallet/:userId", fundWallet);
router.post("/loginuser", loginUser);
router.get("/one_user/:userId", findOneUser);
router.patch("/change_password/:userId", changePassword);
router.post("/convert_airtime_to_cash/:userId", convertAirtimeToCash);
router.patch("/upload_image", uploadImage);

export default router;
