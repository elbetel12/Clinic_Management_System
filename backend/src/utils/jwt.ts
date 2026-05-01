import  jwt, { Secret } from 'jsonwebtoken';
import { JwtPayload } from '../modules/auth/auth.types';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

//generate JWT token
export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

//verify JWT token 
export const verifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded as JwtPayload; 
    } catch (error) {
        throw new Error('Invalid or expired token');
    }   
}