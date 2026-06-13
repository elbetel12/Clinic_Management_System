import { Request, Response } from 'express';
import User from './user.model';

export const getMeHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMeHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { name, phone, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, avatar },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
