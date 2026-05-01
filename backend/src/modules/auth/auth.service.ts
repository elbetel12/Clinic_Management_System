import { CreateUserInput } from '../user/user.type';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import mongoose from 'mongoose';

export const registerUser = async (userData : CreateUserInput) =>{
   const existingUser = await User.findOne({email:userData.email});
   if(existingUser){
    throw new Error('User with this email already exists');
   }
   const passwordHash = await bcrypt.hash(userData.password,10);
    const newUser = new User({
        name:userData.name,
        email:userData.email,
        password:passwordHash,
        role:userData.role
    })
    await newUser.save();
    return newUser;
}

export const  loginUser = async (email:string,password:string) =>{
    const user = await User.findOne({email}).select('+password');
    if(!user){
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new Error('Invalid email or password');
    }

    const token = generateToken({userId: user._id.toString(), role: user.role});

    return {token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        }
     };
}