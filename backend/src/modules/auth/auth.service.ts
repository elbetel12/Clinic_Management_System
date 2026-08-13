import { CreateUserInput, UserRole } from '../user/user.type';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import { createDoctor } from '../doctor/doctor.service';
import { AppError } from '../../utils/appError';

export const registerUser = async (userData: CreateUserInput) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('User with this email already exists',400);
    }
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: passwordHash,
        role: userData.role
    })
    await newUser.save();

    // If user is a doctor, create a Doctor profile
    if (userData.role === UserRole.Doctor) {
        await createDoctor({
            userId: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            specialization: userData.specialization || 'General Practice'
        });
    }

    return newUser;
}

export const  loginUser = async (email:string,password:string) =>{
    const user = await User.findOne({email}).select('+password');
    if(!user){
        throw new AppError('Invalid email or password',401);
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new AppError('Invalid email or password',401);
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