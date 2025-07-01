import express from "express";
import { signinuser, signupuser } from "../controllers/authController.js";
const router=express.Router();
router.post("/sign-up",signupuser)
router.post("/sign-in",signinuser)

export default router;