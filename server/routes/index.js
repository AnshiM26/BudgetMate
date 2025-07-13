import express from 'express';
import authRoute from "./authRoute.js"
import accRoute from "./accRoute.js"
import transactionRoute from "./transactionRoute.js"
import userRoute from "./userRoute.js"


const router=express.Router();

router.use("/auth",authRoute)
router.use("/user",userRoute)
router.use("/account",accRoute)
router.use("/transaction",transactionRoute)


export default router;