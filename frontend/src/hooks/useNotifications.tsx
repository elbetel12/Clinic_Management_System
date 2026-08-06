import { Notification, NotificationType } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as notificationService from '../services/notificationService';


interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, type?: NotificationType) => void;
    markAllRead: () => void;
    markAsRead: (notificationId: string) => void;
}


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, socket } = useAuth();

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const response: any = await notificationService.fetchNotifications();
            setNotifications(response);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const addNotification = (title: string, type: NotificationType = "info") => {
        const newItem: Notification = {
            id: Date.now(),
            title,
            time: "just now",
            isRead: false,
            type,
        };
        setNotifications(prev => [...prev, newItem]);
    };

    // 1. Mark ALL notifications as read
    const markAllRead = async () => {
        // Optimistic UI update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await notificationService.markAllNotificationsAsRead();
            console.log('✅ All notifications marked as read in database');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // 2. Mark a SINGLE notification as read
    const markAsRead = async (notificationId: string) => {
        // Optimistic UI update: instantly mark target notification as read in state
        setNotifications(prev =>
            prev.map(n =>
                (String(n.id) === notificationId || String((n as any)._id) === notificationId)
                    ? { ...n, isRead: true }
                    : n
            )
        );

        try {
            await notificationService.markNotificationAsRead(notificationId);
            console.log(`✅ Notification ${notificationId} marked as read in database`);
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as read:`, error);
        }
    };

    useEffect(() => {
        if (!socket) return;
        socket.on('new_notification', (data) => {
            console.log('Received notification:', data);
            addNotification(data.title, data.type);
        });

        return () => {
            socket.off('new_notification');
        };
    }, [socket]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        markAsRead // Exposing markAsRead to all consumer components
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
