import Notification from "./notification.model";
import { AppError } from "../../utils/appError";

export const getNotifications = async (userId:string) => {
    return await Notification.find({user:userId}).sort({createdAt:-1});
}

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const result = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );
        return result;
    } catch (error: Error | unknown) {
        if(error instanceof AppError) {
            throw error;
        }
        else {
            throw new AppError('Internal server error',500);
        }
    }
}

export const markAllNotificationsAsRead = async (userId: string) => {
    return await Notification.updateMany( 
            {user:userId, isRead: false},
            { isRead: true }
        );
    }