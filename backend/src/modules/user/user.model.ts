import mongoose from 'mongoose';
import { UserRole } from './user.type';
import joi from 'joi';

const userScema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
         trim:true,
         minlength:2,
         maxlength:50,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{9,15}$/, "Invalid phone number"]
    },          
    password:{  
        type:String,
        required:[true,'Password is required'],
        minlength:6,
        select:false, // do not return password by default
    },
    role:{
        type:String,
        enum: Object.values(UserRole),
        default:'patient',
        required:true

    },
},
{
    timestamps:true
    }
)

const User = mongoose.model('User',userScema);

export default User;