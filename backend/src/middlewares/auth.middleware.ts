import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "../modules/auth/auth.types";

// Extend Request interface locally
declare module 'express' {
    interface Request {
        user?: JwtPayload;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);

        // Attach user info to request object
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}