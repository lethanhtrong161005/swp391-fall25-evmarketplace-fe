import React from "react";
import { Typography, Tag, Avatar, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import {
  getNotificationIcon,
  getNotificationColor,
  getNotificationTitle,
  formatNotificationTime,
} from "@utils/notificationUtils";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title } = Typography;

const NotificationItem = ({ notification, onClick, isCompact = false }) => {
  const getIcon = (type) => {
    const iconMap = {
      CheckCircleOutlined: <CheckCircleOutlined />,
      CloseCircleOutlined: <CloseCircleOutlined />,
      ClockCircleOutlined: <ClockCircleOutlined />,
      ExclamationCircleOutlined: <ExclamationCircleOutlined />,
      HeartOutlined: <HeartOutlined />,
      BellOutlined: <BellOutlined />,
    };
    return iconMap[getNotificationIcon(type)] || <BellOutlined />;
  };

  const color = getNotificationColor(notification.type);
  const title = getNotificationTitle(notification.type);

  if (isCompact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          cursor: "pointer",
          borderRadius: "8px",
          background: notification.isRead ? "#fafafa" : "#f0f8ff",
          border: notification.isRead
            ? "1px solid #e8e8e8"
            : `1px solid ${color}40`,
          transition: "all 0.2s ease",
        }}
        onClick={() => onClick?.(notification)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = notification.isRead
            ? "#f5f5f5"
            : "#e6f7ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = notification.isRead
            ? "#fafafa"
            : "#f0f8ff";
        }}
      >
        <Avatar
          size="small"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
            color: "white",
          }}
          icon={getIcon(notification.type)}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text
            strong
            style={{
              fontSize: "13px",
              color: notification.isRead ? "#666" : "#262626",
              display: "block",
              marginBottom: 2,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              color: "#8c8c8c",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notification.message}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          {!notification.isRead && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
              }}
            />
          )}
          <Text
            type="secondary"
            style={{ fontSize: "11px", whiteSpace: "nowrap" }}
          >
            {formatNotificationTime(notification.createdAt)}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "16px",
        marginBottom: 12,
        cursor: "pointer",
        borderRadius: "12px",
        background: notification.isRead
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 0.95)",
        border: notification.isRead
          ? "1px solid rgba(240, 240, 240, 0.5)"
          : `2px solid ${color}40`,
        boxShadow: notification.isRead
          ? "0 2px 8px rgba(0,0,0,0.05)"
          : `0 4px 20px ${color}20`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={() => onClick?.(notification)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = notification.isRead
          ? "0 2px 8px rgba(0,0,0,0.05)"
          : `0 4px 20px ${color}20`;
      }}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            animation: "pulse 2s infinite",
          }}
        />
      )}

      {/* Avatar */}
      <Avatar
        size={48}
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
          color: "white",
          flexShrink: 0,
          boxShadow: `0 4px 12px ${color}40`,
        }}
        icon={getIcon(notification.type)}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "15px",
                  color: "#262626",
                  background: notification.isRead
                    ? "none"
                    : `linear-gradient(135deg, ${color}, #1890ff)`,
                  backgroundClip: notification.isRead ? "initial" : "text",
                  WebkitBackgroundClip: notification.isRead
                    ? "initial"
                    : "text",
                  WebkitTextFillColor: notification.isRead
                    ? "initial"
                    : "transparent",
                }}
              >
                {title}
              </Text>
              <Tag
                size="small"
                color={color}
                style={{
                  fontSize: "10px",
                  borderRadius: "12px",
                  border: "none",
                  background: `${color}20`,
                  color: color,
                }}
              >
                {notification.type?.replace(/_/g, " ")}
              </Tag>
            </div>
          </div>
          <Text
            type="secondary"
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              marginLeft: 8,
              color: "#8c8c8c",
            }}
          >
            {formatNotificationTime(notification.createdAt)}
          </Text>
        </div>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#595959",
            display: "block",
            marginBottom: notification.referenceId ? 8 : 0,
          }}
        >
          {notification.message}
        </Text>

        {notification.referenceId && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tag
              size="small"
              style={{
                fontSize: "11px",
                borderRadius: "8px",
                background: "rgba(24, 144, 255, 0.1)",
                color: "#1890ff",
                border: "1px solid rgba(24, 144, 255, 0.2)",
              }}
            >
              ID: {notification.referenceId}
            </Tag>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
