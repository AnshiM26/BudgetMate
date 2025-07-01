export const getUser = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
export const changePass=async(req,res)=>{
    try {
        
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
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
        })
    }
}