import { Notification, NotificationType } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as notificationService from '../services/notificationService';
import { useToast } from "@/components/ui/use-toast";


interface NotificationPayload {
    id?: string | number;
    _id?: string;
    title: string;
    message?: string;
    type?: NotificationType;
    time?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (payload: string | NotificationPayload, type?: NotificationType) => void;
    markAllRead: () => void;
    markAsRead: (notificationId: string) => void;
}


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, socket } = useAuth();
    const { toast } = useToast();

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const response: any = await notificationService.fetchNotifications();
            // Ensure response array items have id property matching _id if needed
            const formatted = Array.isArray(response) ? response.map(n => ({
                ...n,
                id: n.id || n._id,
                time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'
            })) : [];
            setNotifications(formatted);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const addNotification = (payload: string | NotificationPayload, defaultType: NotificationType = "info") => {
        let newItem: Notification;
        if (typeof payload === 'string') {
            newItem = {
                id: Date.now(),
                title: payload,
                message: undefined,
                time: "just now",
                isRead: false,
                type: defaultType,
            };
        } else {
            newItem = {
                id: payload.id || payload._id || Date.now(),
                _id: payload._id || (typeof payload.id === 'string' ? payload.id : undefined),
                title: payload.title,
                message: payload.message,
                time: payload.time || "just now",
                isRead: false,
                type: payload.type || defaultType,
            };
        }

        setNotifications(prev => [newItem, ...prev]);

        toast({
            title: newItem.title,
            description: newItem.message || "View notification for details",
            variant: newItem.type === "error" ? "destructive" : "default",
            duration: 5000,
        });
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
                (String(n.id) === notificationId || String(n._id) === notificationId)
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
        const handleNewNotification = (data: any) => {
            console.log('Received real-time notification:', data);
            addNotification({
                id: data.id || data._id,
                _id: data.id || data._id,
                title: data.title,
                message: data.message,
                type: data.type,
                time: data.time || 'just now'
            });
        };

        socket.on('new_notification', handleNewNotification);

        return () => {
            socket.off('new_notification', handleNewNotification);
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
