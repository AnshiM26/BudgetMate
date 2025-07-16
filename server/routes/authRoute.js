import express from "express";
import { signinuser, signupuser } from "../controllers/authController.js";
import { oauthLogin } from "../controllers/authController.js";
const router=express.Router();
router.post("/google-login", oauthLogin);
router.post("/sign-up",signupuser)
router.post("/sign-in",signinuser)

export default router;