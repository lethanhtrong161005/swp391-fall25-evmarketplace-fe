import React from "react";
import { Modal, Button } from "antd";
import { CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");
import {
  getNotificationIcon,
  getNotificationColor,
  getNotificationTitle,
} from "../notificationUtils";
import "./NotificationModal.style.scss";

const getStatusBadgeStyle = (type) => {
  const styles = {
    LISTING_APPROVED: {
      backgroundColor: "#f6ffed",
      color: "#52c41a",
    },
    LISTING_REJECTED: {
      backgroundColor: "#fff2f0",
      color: "#ff4d4f",
    },
    LISTING_PENDING: {
      backgroundColor: "#fffbe6",
      color: "#faad14",
    },
    default: {
      backgroundColor: "#e6f7ff",
      color: "#1890ff",
    },
  };
  return styles[type] || styles.default;
};

const NotificationModal = ({ visible, notification, onClose }) => {
  if (!notification) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className="notification-modal"
      closeIcon={<CloseCircleOutlined />}
    >
      <div className="notification-modal-content">
        <div className="notification-modal-header">
          <div
            className="notification-modal-icon"
            style={{
              backgroundColor: getNotificationColor(notification.type),
            }}
          >
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-modal-title-group">
            <div className="notification-modal-title">
              {notification.title || getNotificationTitle(notification.type)}
            </div>
            <div className="notification-modal-subtitle">
              {getNotificationTitle(notification.type)}
            </div>
          </div>
        </div>

        <div className="notification-modal-status">
          <div
            className="status-badge"
            style={getStatusBadgeStyle(notification.type)}
          >
            {getNotificationTitle(notification.type)}
          </div>
        </div>

        <div className="notification-modal-body">
          {notification.message || "Không có nội dung chi tiết."}
        </div>

        <div className="notification-modal-footer">
          <div className="notification-modal-timestamp">
            <ClockCircleOutlined />
            <span>{dayjs(notification.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
