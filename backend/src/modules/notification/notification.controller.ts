import { Request,Response } from "express";
import { getNotifications,markAllNotificationsAsRead,markNotificationAsRead } from "./notification.service";


export const getNotificationsHandler = async (req:Request,res:Response)=>{
      try {
           const userId = req.user?.userId as string;
           if (!userId) {
               return res.status(400).json({ message: 'User ID is missing in the request' });
           }
           const notifications = await getNotifications(userId);
           res.status(200).json(notifications);
       } catch (error: Error | unknown) {
           res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
       }
}

export const markNotificationAsReadHandler = async (req:Request,res:Response) =>{
    try {
        const notificationId = req.params.notificationId as string
        console.log("Marking notification as read:", notificationId);
        const notifications = await markNotificationAsRead(notificationId);
        console.log('✅ Notification updated:', notifications);
        res.status(200).json(notifications)
    }catch (error: Error | unknown) {
           res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
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
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
}