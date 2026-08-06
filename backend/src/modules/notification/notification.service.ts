import Notification from "./notification.model";

export const getNotifications = async (userId:string) => {
    return await Notification.find({user:userId}).sort({createdAt:-1});
}

export const markNotificationAsRead = async (notificationId: string) => {
    console.log('🔍 Service: Starting markNotificationAsRead');
    console.log('🔍 Service: notificationId =', notificationId);
    console.log('🔍 Service: notificationId type =', typeof notificationId);
    
    try {
        const result = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );
        console.log('✅ Service: Update result =', result);
        return result;
    } catch (error) {
        console.error('❌ Service: Error during findByIdAndUpdate:', error);
        throw error;
    }
}

export const markAllNotificationsAsRead = async (userId: string) => {
    return await Notification.updateMany( 
            {user:userId, isRead: false},
            { isRead: true }
        );
    }