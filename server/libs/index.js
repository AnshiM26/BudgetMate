import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashedpassword = async (userPass) => {
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(userPass, salt);
  return hashpassword;
};

export const comparePass = async (userPass, dbpass) => {
  try {
    const match = await bcrypt.compare(userPass, dbpass);
    return match;
  } catch (error) {
    console.error(error);
  }
};

export const JWT = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export function getMonthName(index){
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[index];
}
