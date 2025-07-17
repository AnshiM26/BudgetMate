import { hashedpassword } from "../libs/index.js";
import { pool } from "../libs/db.js";
import { comparePass } from "../libs/index.js";
export const getUser = async (req, res) => {
  try {
    const {userId}=req.user;
    const userExists=await pool.query({
        text:`SELECT * FROM tbluser WHERE id=$1`,
        values:[userId]
    });

    const user=userExists.rows[0]

    if(!user){
        return res.status(404).json({
            status:"failed",
            message:"User not found"
        })
    }

    user.password=undefined;
    res.status(201).json({
        status:"success",
        user
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const changePass=async(req,res)=>{
    try {
        const {userId}=req.user;
        const {currpass,newpass,confirmpass}=req.body
        const userExist=await pool.query({
            text:`SELECT * FROM tbluser WHERE id=$1`,
            values:[userId],
        });
        const user=userExist.rows[0];
        if(userExist.rows.length === 0){
            return res.status(404).json({status:"failed",message:"User not found"})
        }
        if(newpass!==confirmpass){
            return res.status(401).json({
                status:"failed",
                message:"Passwords don't match"
            })
        }
        const isMatch=await comparePass(currpass,user?.password);
        if(!isMatch){
            return res.status(401).json({status:"failed",message:"Invalid current password"})
        }
        const hashedpass=await hashedpassword(newpass)
        await pool.query({
            text:`UPDATE tbluser SET password=$1 WHERE id=$2`,
            values:[hashedpass,userId]
        })
        res.status(200).json({
            status:"success",
            message:"Password changed successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}
export const updateUser=async(req,res)=>{
    try {
        const {userId}=req.user;
        const {fname, lname, country, currency, contact}=req.body;
        const userExists=await pool.query({
            text:`SELECT * FROM tbluser WHERE id=$1`,
            values:[userId]
        })
        const user=userExists.rows[0];
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"User not found"
            })
        }
        const updatedUser=await pool.query({
            text:`UPDATE tbluser SET firstname=$1 , lastname=$2, country=$3, currency=$4, contact=$5, updatedat=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *`,
            values:[fname, lname, country, currency, contact, userId]
        });
        updatedUser.rows[0].password=undefined;
        res.status(200).json({
            status:"success",
            message:"Updated successfully!",
            user:updatedUser.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}