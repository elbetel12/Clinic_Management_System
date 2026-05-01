import { registerUser } from "./auth.service";
import { Request,Response } from "express";
import { loginUser } from "./auth.service";

export const RegisterHandler = async(req:Request,res:Response)=>{
  try {
    const user = await registerUser(req.body);
    res.status(201).json({success : true,data:user});
  } catch (error : Error | unknown) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}

export const LoginHandler = async(req:Request,res:Response)=>{

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const result = await loginUser(email, password);

    res.status(200).json({success : true,message:'Login successful',data:result});
  } catch (error : Error | unknown) {
    return res.status(401).json({success : false,message: error instanceof Error ? error.message : 'An unexpected error occurred' });
  }
}