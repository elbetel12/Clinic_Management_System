import { Request,Response } from "express";
import { getNotifications,markAllNotificationsAsRead,markNotificationAsRead } from "./notification.service";
import { AppError } from "../../utils/appError";

export const getNotificationsHandler = async (req:Request,res:Response)=>{
      try {
           const userId = req.user?.userId as string;
           if (!userId) {
               return res.status(400).json({ message: 'User ID is missing in the request' });
           }
           const notifications = await getNotifications(userId);
           res.status(200).json(notifications);
       } catch (error: Error | unknown) {
              if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
       }
}

export const markNotificationAsReadHandler = async (req:Request,res:Response) =>{
    try {
        const notificationId = req.params.notificationId as string
        const notifications = await markNotificationAsRead(notificationId);
        res.status(200).json(notifications)
    }catch (error: Error | unknown) {
              if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
       }
}

export const markAllNotificationAsReadHandler = async (req:Request,res:Response) =>{
    try{
        const userId = req.user?.userId as string;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing in the request' });
        }
        const result = await markAllNotificationsAsRead(userId);
        res.status(200).json({ message: 'All notifications marked as read', count: result.modifiedCount });
    } catch (error: Error | unknown) {
              if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}