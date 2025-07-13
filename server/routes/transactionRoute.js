import express from "express";
import {addTransaction,getDashboard,getTransaction,transferMoney} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/",authMiddleware,getTransaction);
router.get("/dashboard",authMiddleware,getDashboard);
router.post("/add-transaction/:account_id",authMiddleware,addTransaction);
router.put("/transfer-money",authMiddleware,transferMoney);

export default router;