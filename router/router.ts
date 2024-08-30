import { Router } from "express";
import {
  fundWallet,
  loginUser,
  signUpUser,
} from "../controller/userController";

const router = Router();

router.post("/createuser", signUpUser);
router.patch("/fund-wallet/:userId", fundWallet);
router.post("/loginuser", loginUser);

export default router;
