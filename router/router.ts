import { Router } from "express";
import {
  changePassword,
  findOneUser,
  fundWallet,
  loginUser,
  signUpUser,
} from "../controller/userController";

const router = Router();

router.post("/createuser", signUpUser);
router.patch("/fund-wallet/:userId", fundWallet);
router.post("/loginuser", loginUser);
router.get("/one_user/:userId", findOneUser);
router.patch("/change_password/:userId", changePassword);

export default router;
