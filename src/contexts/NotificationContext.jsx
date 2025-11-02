import React, { useEffect, useState, useCallback } from "react";
import notificationService from "@services/notificationService";
import { useAuth } from "./AuthContext";
import cookieUtils from "@utils/cookieUtils";
import FEATURE_FLAGS from "@config/featureFlags";
import { NotificationContext } from "./NotificationContext";

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { user, isLoggedIn } = useAuth();

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === notification.id);
      if (exists) return prev;
      return [notification, ...prev];
    });

    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    const token = cookieUtils.getToken();
    if (!token) return;

    const success = await notificationService.markAsRead(notificationId, token);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const token = cookieUtils.getToken();
    if (!token) return;

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    for (const notification of unreadNotifications) {
      await notificationService.markAsRead(notification.id, token);
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [notifications]);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const connect = useCallback(async () => {
    if (!isLoggedIn || !user) return;

    try {
      setConnectionStatus("connecting");
      const token = cookieUtils.getToken();

      if (!token) {
        setConnectionStatus("no_token");
        setIsConnected(false);
        return;
      }

      await notificationService.connect(token);
      setIsConnected(true);
      setConnectionStatus("connected");
    } catch {
      setConnectionStatus("error");
      setIsConnected(false);
    }
  }, [isLoggedIn, user]);

  const disconnect = useCallback(() => {
    notificationService.disconnect();
    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, []);

  const fetchNotifications = useCallback(
    async (page = 0, size = 20, append = false) => {
      if (!isLoggedIn) return { hasMore: false, items: [] };

      const token = cookieUtils.getToken();
      if (!token) return { hasMore: false, items: [] };

      try {
        const result = await notificationService.getNotifications(
          token,
          page,
          size
        );

        // Service returns normalized object directly, not wrapped in .data
        if (!result) {
          if (!append) {
            setNotifications([]);
            setTotalCount(0);
            setUnreadCount(0);
          }
          return { hasMore: false, items: [] };
        }

        // Access result directly (not result.data)
        const items = result.items || [];
        const hasNext = result.hasNext || false;
        const total =
          typeof result.total === "number"
            ? result.total
            : // Khi Slice: không có total, dùng công thức gần đúng:
            result.hasNext === false
            ? (page || 0) * size + items.length
            : null;

        // Append or replace notifications
        setNotifications((prev) => {
          if (append) {
            // Remove duplicates when appending
            const existingIds = new Set(prev.map((n) => n.id));
            const newItems = items.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          }
          return items;
        });

        setTotalCount(typeof total === "number" ? Number(total) : total ?? 0);

        // Calculate unread count from all notifications
        setNotifications((currentNotifications) => {
          const unread = currentNotifications.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
          return currentNotifications;
        });

        return { hasMore: hasNext, items };
      } catch {
        return { hasMore: false, items: [] };
      }
    },
    [isLoggedIn]
  );

  useEffect(() => {
    if (!FEATURE_FLAGS.ENABLE_NOTIFICATIONS) return;
    if (isLoggedIn && user) {
      const timer = setTimeout(() => {
        connect().catch(() => {
          // Silent error handling
        });
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      disconnect();
      clearAllNotifications();
    }
  }, [isLoggedIn, user, connect, disconnect, clearAllNotifications]);

  useEffect(() => {
    const handleNotification = (event, data) => {
      if (event === "notification") {
        const newNotification = {
          ...data,
          id: data.id || `ws_${Date.now()}_${Math.random()}`,
          createdAt: data.createdAt || new Date().toISOString(),
          isRead: data.isRead || false,
        };
        addNotification(newNotification);
      }
    };

    const handleConnectionStatus = (event) => {
      if (event === "connected") {
        setConnectionStatus("connected");
        setIsConnected(true);
      } else if (event === "error") {
        setConnectionStatus("error");
        setIsConnected(false);
      } else if (event === "disconnected") {
        setConnectionStatus("disconnected");
        setIsConnected(false);
      }
    };

    notificationService.addListener(handleNotification);
    notificationService.addListener(handleConnectionStatus);

    return () => {
      notificationService.removeListener(handleNotification);
      notificationService.removeListener(handleConnectionStatus);
    };
  }, [addNotification]);

  useEffect(() => {
    fetchNotifications(0, 20);
  }, [fetchNotifications]);

  useEffect(() => {
    return () => {
      notificationService.disconnect();
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    totalCount,
    isConnected,
    connectionStatus,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    connect,
    disconnect,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationProvider };
