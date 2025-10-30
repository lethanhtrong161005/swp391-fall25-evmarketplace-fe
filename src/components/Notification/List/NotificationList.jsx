import React from "react";
import { Empty, Tag } from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");
import "./NotificationList.style.scss";

const getStatusBadge = (type) => {
  const statusMap = {
    LISTING_APPROVED: { text: "Đã duyệt", color: "success" },
    LISTING_REJECTED: { text: "Bị từ chối", color: "error" },
    LISTING_PENDING: { text: "Chờ duyệt", color: "warning" },
    LISTING_EXPIRED: { text: "Hết hạn", color: "default" },
    LISTING_LIKED: { text: "Được yêu thích", color: "magenta" },
    MESSAGE: { text: "Tin nhắn mới", color: "blue" },
    PRICE_DROP: { text: "Giảm giá", color: "purple" },
  };
  return statusMap[type] || { text: "Thông báo", color: "default" };
};

const NotificationList = ({
  notifications,
  onNotificationClick,
  getNotificationIcon,
  getNotificationColor,
}) => {
  if (notifications.length === 0) {
    return (
      <Empty
        image={<BellOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />}
        description="Không có thông báo nào"
        style={{ padding: "48px 24px" }}
      />
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notification, index) => (
        <div key={notification.id}>
          <div
            className={`notification-item ${
              notification.isRead ? "read" : ""
            } ${notification.type === "LISTING_REJECTED" ? "rejected" : ""}`}
            onClick={() => onNotificationClick(notification)}
          >
            <div
              className="notification-icon-container"
              style={{
                backgroundColor: getNotificationColor(notification.type),
              }}
            >
              {getNotificationIcon(notification.type)}
            </div>

            <div className="notification-content">
              <div className="notification-header">
                <div className="notification-title">{notification.title}</div>
                <Tag
                  color={getStatusBadge(notification.type).color}
                  size="small"
                >
                  {getStatusBadge(notification.type).text}
                </Tag>
              </div>
              <div className="notification-message">
                {notification.type === "LISTING_REJECTED"
                  ? `Lý do: ${notification.message}`
                  : notification.message}
              </div>
              <div className="notification-time">
                {dayjs(notification.createdAt).fromNow()}
              </div>
            </div>

            {!notification.isRead && <div className="unread-indicator" />}
          </div>
          {index < notifications.length - 1 && (
            <div className="notification-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
