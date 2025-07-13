import { pool } from "../libs/db.js";

export const getAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id=$1`,
      values: [userId],
    });
    res.status(200).json({ status: "success", data: accounts.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const {userId}=req.user;
    const {name,amount,accno}=req.body;
    const accountExists={
        text:`SELECT * FROM tblaccount WHERE account_name=$1 AND user_id=$2`,
        values:[name, userId]
    }
    const accountExistRes=await pool.query(accountExists)
    const accExists=accountExistRes.rows[0];
    if(accExists){
        return res.status(409).json({status:"failed",message:"Account already exists!"});
    }
    const createAcc=await pool.query({
        text:`INSERT INTO tblaccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
        values:[userId, name, accno, amount]
    });
    const account=createAcc.rows[0];
    const userAccounts=Array.isArray(name)?name:[name] //account name should be in an array form
    const updateUserAccountQuery={
      text:`UPDATE tbluser SET accounts=array_cat(accounts,$1), updatedat=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
      values:[userAccounts,userId],
    }
    await pool.query(updateUserAccountQuery);
    //initial deposit
    const description=account.account_name+"(Initial Deposit)";
    const initialDepositQuery={
      text:'INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values:[
        userId, description,"income","Completed",amount, account.account_name,
      ]
    }
    await pool.query(initialDepositQuery);
    res.status(201).json({
      status:"success",
      message:account.account_name+" Account created successfully",
      data:account
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
export const addMoney = async (req, res) => {
  try {
    const {userId}=req.user;
    const {id}=req.params;
    const {amount}=req.body;
    const newAmount=Number(amount);
    const result=await pool.query({
      text:`UPDATE tblaccount SET account_balance=(account_balance+$1), updatedat=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
      values:[newAmount, id]
    });
    const accountInformation=result.rows[0];
    const description=accountInformation.account_name+"(Deposit)";
    const transactionQuery={
      text:`INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES($1, $2, $3, $4, $5, $6)`,
      values:[
        userId,
        description,
        "income",
        "Completed",
        amount,
        accountInformation.account_name,
      ]
    }
    await pool.query(transactionQuery);
    res.status(200).json({
      status:"success",
      message:"Transaction added successfully",
      data:accountInformation
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
