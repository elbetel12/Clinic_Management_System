import { Notification,NotificationType } from "@/types";
import React, { createContext, useContext, useState } from "react";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string,type?:NotificationType) => void;
    markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
        id: 1,
        title: "Welcome to NovaCare!",
        time: "2 hours ago",
        isRead: false,
        type: "info"
    }
]);

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    const addNotification = (title: string,type:NotificationType = "info") => {
        const newItem: Notification = {
            id: Date.now(),
            title,
            time: "just now",
            isRead: false,
            type,
        };
        setNotifications(prev => [...prev, newItem]);
    }

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    }

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAllRead
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;

}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
