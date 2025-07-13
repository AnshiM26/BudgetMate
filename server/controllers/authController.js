import { pool } from "../libs/db.js";
import { hashedpassword,comparePass,JWT } from "../libs/index.js";

export const signupuser=async(req,res)=>{
    try {
        const {firstName, email, password}=req.body;
        if(!(firstName || email ||password)){
            return res.status(404).json({
                status:"Failed!",
                message:"Provide Required Fields!"
            })
        }
        const userExist=await pool.query({
            text:"SELECT EXISTS (SELECT * FROM tbluser WHERE email=$1)",
            values:[email]
        });
        if(userExist.rows[0].exists){
            return res.status(409).json({
                status:"Failed!",
                message:"User already exists! Try Signing in."
            })
        }
        const hashedpass=await hashedpassword(password);
        const user=await pool.query({
            text:`INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
            values:[firstName,email,hashedpass]
        });

        user.rows[0].password=undefined
        res.status(201).json({
            status:"success",
            message:"Account created successfully!",
            user:user.rows[0]
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({status:"failed",message:error.message});
    }
}



export const signinuser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const result=await pool.query({
            text:`SELECT * FROM tbluser WHERE email=$1`,
            values:[email]
        })

        const user=result.rows[0];
        if(!user){
            return res.status(404).json({
                status:"failed email",
                message:"Invalid email or password!"
            })
        }

        const matched=await comparePass(password,user?.password)
        if(!matched){
            return res.status(404).json({
                status:"failed password",
                message:"Invalid email and password!"
            })
        }

        //if both email and passowrd are correct, token will be created

        const token=JWT(user.id)
        user.password=undefined
        res.status(200).json({
            status:"success",
            message:"Logged In!",
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({status:"failed",message:error.message});
    }
}


