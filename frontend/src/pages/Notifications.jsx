import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socket.js';
import { formatDate } from '../utils/helpers.js';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            // Connect socket
            const socket = socketService.connect(user.id);

            // Listen for hired notification
            socket.on('hired', (data) => {
                setNotifications(prev => [{
                    id: Date.now(),
                    type: 'hired',
                    message: data.message,
                    gigTitle: data.gigTitle,
                    timestamp: new Date().toISOString(),
                    read: false
                }, ...prev]);
            });

            return () => {
                socketService.disconnect();
            };
        }
    }, [user]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-600 mt-2">
                        Real-time updates about your bids and gigs
                    </p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                        No notifications yet
                    </h2>
                    <p className="text-gray-500">
                        You'll receive real-time notifications here when you get hired or have updates on your bids
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-lg shadow-md border p-6 ${!notification.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        {!notification.read && (
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                        )}
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {notification.type === 'hired' ? '🎉 Congratulations!' : 'Notification'}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {notification.message}
                                        {notification.gigTitle && (
                                            <span className="font-medium"> — {notification.gigTitle}</span>
                                        )}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
