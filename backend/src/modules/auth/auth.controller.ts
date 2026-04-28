import { registerUser } from "./auth.service";
import { Request,Response } from "express";

export const CreateUser = async(req:Request,res:Response)=>{
  try {
    const user = await registerUser(req.body);
    res.status(201).json({success : true,data:user});
  } catch (error : Error | unknown) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}