import express from 'express';
import {addMoney,createAccount,getAccount} from "../controllers/accController.js"
import authMiddleware from '../middleware/authMiddleware.js';
const router=express.Router();
router.get(['/','/:id'],authMiddleware,getAccount);
router.post("/create",authMiddleware,createAccount);
router.put("/add-money/:id",authMiddleware,addMoney)
export default router;