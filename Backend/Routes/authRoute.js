import express from "express";
import { signup, signIn, logout } from "../Controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signIn);
router.post("/logout", logout);

export default router;
