import React, { useEffect } from "react";
import { notification } from "antd";
import { useNotifications } from "@contexts/NotificationContext";
import {
  shouldShowToast,
  getNotificationColor,
  getNotificationTitle,
} from "@utils/notificationUtils";

const NotificationToast = () => {
  const { notifications } = useNotifications();

  useEffect(() => {
    // Lắng nghe thông báo mới và hiển thị toast
    const latestNotification = notifications[0];
    if (latestNotification && shouldShowToast(latestNotification)) {
      const color = getNotificationColor(latestNotification.type);
      const title = getNotificationTitle(latestNotification.type);

      notification.open({
        message: title,
        description: latestNotification.message,
        duration: 4.5,
        placement: "topRight",
        style: {
          borderLeft: `4px solid ${color}`,
          borderRadius: "8px",
          boxShadow: `0 4px 12px ${color}20`,
        },
        icon: (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            🔔
          </div>
        ),
        onClick: () => {
          // Có thể thêm logic để navigate đến trang liên quan
          console.log("Toast clicked:", latestNotification);
        },
      });
    }
  }, [notifications]);

  return null; // Component này không render gì
};

export default NotificationToast;
