import JWT from "jsonwebtoken";

const authMiddleware=async(req,res,next)=>{
    const header=req?.headers?.authorization;
    if(!header || !header.startsWith("Bearer")){
        return res.status(401).json({
            status:"failed-auth",
            message:"Authentication failed!"
        })
    }
    const token=header?.split(" ")[1]; //bearer jcjwecwe
    try {
        const userToken=JWT.verify(token,process.env.JWT_SECRET);
        req.body.user={
            userId:userToken.userId
        };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status:"failed-auth",
            message:"Authentication failed"
        })
    }
}

export default authMiddleware;