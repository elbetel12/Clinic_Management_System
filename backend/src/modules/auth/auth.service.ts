import { CreateUserInput } from '../user/user.type';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export const registerUser = async (userData : CreateUserInput) =>{
    console.log("Database State:", mongoose.connection.readyState);
   const existingUser=await User.findOne({email:userData.email});
   if(existingUser){
    throw new Error('User with this email already exists');
   }
   const passwordHash = await bcrypt.hash(userData.password,10);
    const newUser = new User({
        name:userData.name,
        email:userData.email,
        password:passwordHash,
    })
    await newUser.save();
    return newUser;
}