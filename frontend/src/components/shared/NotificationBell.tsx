import { useNotification } from "@/hooks/useNotifications";
import { Bell, CheckCheck, Clock } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export function NotificationBell() {
    const { unreadCount, markAllRead, notifications } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
                <Bell size={22} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white border border-white">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-black">
                                    {unreadCount} NEW
                                </span>
                            )}
                        </h3>
                        <button 
                            onClick={() => { markAllRead(); setIsOpen(false); }}
                            className="text-[11px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                        >
                            <CheckCheck size={14} />
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative group ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                >
                                    {!n.isRead &&(
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                            {n.title}
                                        </p>
                                        <div className={`w-2 h-2 rounded-full ${n.type === "success" ? 
                                        "bg-green-500" : n.type === "error"   ? 
                                        "bg-red-500"   : "bg-blue-500"}`} />
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                            <Clock size={12} />
                                            {n.time}
                                        </div>
                                        
                                       </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={20} className="text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                        <button className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                            View all activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}