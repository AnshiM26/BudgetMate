import {pool} from "../libs/db.js";
import { getMonthName } from "../libs/index.js";
export const getTransaction = async (req, res) => {
  try {
    const today = new Date();
    const _sevenDaysAgo = new Date(today);
    _sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];
    const { dfrom, dto, searchterm } = req.query;
    const { userId } = req.user;
    const startDate = new Date(dfrom || sevenDaysAgo);
    const endDate = new Date(dto || new Date());
    const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id=$1 AND updatedat BETWEEN $2 AND $3 AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%') ORDER BY id DESC`,
      values: [userId, startDate, endDate, searchterm],
    });
    res.status(200).json({
      status: "success",
      data: transactions.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const {userId}=req.user;
    let totalIncome=0;
    let totalExpense=0;
    const transactionResult=await pool.query({
        text:`SELECT type, SUM(amount) AS totalAmount FROM tbltransaction WHERE user_id=$1 GROUP BY type`,
        values:[userId]
    })
    const transactions=transactionResult.rows;
    transactions.forEach((transaction)=>{
        if(transaction.type === "income"){
            totalIncome+=transaction.totalamount
        }else{
            totalExpense+=transaction.totalamount
        }
    });

    const availableBalance=totalIncome-totalExpense
    //aggregating transactions to sum by type and group by month
    const year=new Date().getFullYear();
    const start_Date=new Date(year,0,1) //january 1st of the year
    const end_Date=new Date(year,11,31,23,59,59); //december 31st of the year

    const result=await pool.query({
        text:`SELECT EXTRACT(MONTH FROM createdat) AS month,type,SUM(amount) AS totalAmount FROM tbltransaction WHERE user_id=$1 AND createdat BETWEEN $2 AND $3 GROUP BY EXTRACT(MONTH FROM createdat), type`,
        values:[userId, start_Date, end_Date]
    });
    //organizing the data for dashboard
    const data=new Array(12).fill().map((_,index)=>{
        const monthData=result.rows.filter((item)=>parseInt(item.month)===index+1)
        const income=monthData.find((item)=>item.type === 'income')?.totalamount|| 0;
        const expense=monthData.find((item)=>item.type === "expense")?.totalamount || 0;
        return{
            label: getMonthName(index),
            income, expense
        }
    }); 
    //Fetch last 5 transactions
    const lastFiveTrans=await pool.query({
        text:`SELECT * FROM tbltransaction WHERE user_id=$1 ORDER BY id DESC LIMIT 5`,
        values:[userId]
    })
    const lastFiveTransactions=lastFiveTrans.rows;
    //Fetch last accounts
    const lastFourAcc=await pool.query({
        text:`SELECT * FROM tblaccount WHERE user_id=$1 ORDER BY id DESC LIMIT 4`,
        values:[userId]
    })
    const lastFourAccounts=lastFourAcc.rows;
    res.status(200).json({
        status:"success",
        availableBalance,
        totalIncome,
        totalExpense,
        chartData:data,
        lastFiveTransactions,
        lastFourAccounts
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { account_id } = req.params;
    const { description, source, amount } = req.body;
    if (!description || !source || !amount) {
      return res.status(403).json({
        status: "failed",
        message: "Provide required fields!",
      });
    }
    if (Number(amount) <= 0) {
      return res.status.json({
        status: "failed",
        message: "Amount cannot be zero!",
      });
    }
    const result = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id=$1`,
      values: [account_id],
    });
    const accountInfo = result.rows[0];
    if (!accountInfo) {
      return res.status.json({
        status: "failed",
        message: "Invalid account information",
      });
    }
    if (
      accountInfo.account_balance <= 0 ||
      accountInfo.account_balance < Number(amount)
    ) {
      return res.status(403).json({
        status: "failed",
        message: "Transaction failed. Insufficient account balance.",
      });
    }
    //if all queries succeed-then changes are committed. if any query fails, changes can be rolled back
    await pool.query("BEGIN");
    await pool.query({
        text:`UPDATE tblaccount SET account_balance=account_balance-$1, updatedat=CURRENT_TIMESTAMP WHERE id=$2`,
        values:[amount, account_id]
    });
    await pool.query({
        text:`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
        values:[userId, description, "expense", "Completed", amount, source]
    });
    await pool.query("COMMIT");
    res.status(200).json({
        status:"success",
        message:"Transaction registered successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const {userId}=req.user;
    const {from_acc, to_acc, amount}=req.body;
    if(!from_acc || !to_acc || !amount){
        return res.status(403).json({
            status:"failed",
            message:"Provide required fields!"
        });
    }
    const newamt=Number(amount);
    if(newamt<=0){
        return res.status(403).json({
            status:"failed",
            message:"Amount cannot be zero!"
        });
    }
    const fromAccRes=await pool.query({
        text:`SELECT * FROM tblaccount WHERE id=$1`,
        values:[from_acc]
    });
    const fromAccount=fromAccRes.rows[0];
    if(!fromAccount){
        return res.status(403).json({
            status:"Failed",
            message:"Account information not found!"
        })
    }
    if(newamt>fromAccount.account_balance){
        return res.status(403).json({
            status:"failed",
            message:"Transfer failed. Insufficient amount balance."
        })
    }

    await pool.query("BEGIN");
    await pool.query({
        text:`UPDATE tblaccount SET account_balance=account_balance-$1, updatedat=CURRENT_TIMESTAMP WHERE id=$2`,
        values:[newamt,from_acc]
    })
    const toAccount=await pool.query({
        text:`UPDATE tblaccount SET account_balance=account_balance+$1, updatedat=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
        values:[newamt,to_acc]
    })
    const toAcc=toAccount.rows[0];
    const descriptionExpense =`Transfer from ${fromAccount.account_name} to ${toAcc.account_name}`
    await pool.query({
        text:`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
        values:[userId, descriptionExpense, "expense", "Completed", amount, fromAccount.account_name]
    })
    const descriptionIncome=`Received to ${toAcc.account_name} from ${fromAccount.account_name}`
    await pool.query({
        text:`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
        values:[userId, descriptionIncome, "income", "Completed", amount, toAcc.account_name]
    })
    await pool.query("COMMIT");
    res.status(200).json({
  status: "success",
  message: "Transfer completed successfully"
});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
