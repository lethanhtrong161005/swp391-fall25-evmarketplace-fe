import React, { useEffect, useRef } from "react";
import { App, Typography, Tag, Space, theme } from "antd";
import "../notification.scss";
import "./NotificationToast.scss";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useNotifications } from "@hooks/useNotifications";
import {
  shouldShowToast,
  getNotificationTitle,
} from "@components/Notification/notificationUtils";

const getNotificationIconComponent = (type, color) => {
  const iconStyle = {
    fontSize: 20,
    color: color,
  };

  switch (type) {
    case "LISTING_APPROVED":
      return <CheckCircleOutlined style={iconStyle} />;
    case "LISTING_REJECTED":
      return <CloseCircleOutlined style={iconStyle} />;
    case "LISTING_PENDING":
      return <ClockCircleOutlined style={iconStyle} />;
    case "LISTING_EXPIRED":
      return <ExclamationCircleOutlined style={iconStyle} />;
    case "LISTING_LIKED":
      return <HeartOutlined style={iconStyle} />;
    default:
      return <BellOutlined style={iconStyle} />;
  }
};

const NotificationToast = () => {
  const { notifications } = useNotifications();
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const displayedNotificationsRef = useRef(new Set());

  useEffect(() => {
    if (notifications.length === 0) return;

    const latestNotification = notifications[0];

    if (
      latestNotification &&
      !latestNotification.isRead &&
      shouldShowToast(latestNotification) &&
      !displayedNotificationsRef.current.has(latestNotification.id)
    ) {
      const title = getNotificationTitle(latestNotification.type);
      

      const statusMap = {
        LISTING_APPROVED: { text: "Đã duyệt", color: "success" },
        LISTING_REJECTED: { text: "Bị từ chối", color: "error" },
        LISTING_PENDING: { text: "Chờ duyệt", color: "warning" },
        LISTING_EXPIRED: { text: "Hết hạn", color: "default" },
        LISTING_LIKED: { text: "Được yêu thích", color: "magenta" },
      };
      const status = statusMap[latestNotification.type];

      const toneByStatus = (s) => {
        switch (s?.color) {
          case "success":
            return {
              bg: token.colorSuccessBg,
              fg: token.colorSuccess,
              border: token.colorSuccess,
              iconBg: token.colorSuccessBgHover,
            };
          case "error":
            return {
              bg: token.colorErrorBg,
              fg: token.colorError,
              border: token.colorError,
              iconBg: token.colorErrorBgHover,
            };
          case "warning":
            return {
              bg: token.colorWarningBg,
              fg: token.colorWarning,
              border: token.colorWarning,
              iconBg: token.colorWarningBgHover,
            };
          default:
            return {
              bg: token.colorInfoBg,
              fg: token.colorInfo,
              border: token.colorInfo,
              iconBg: token.colorInfoBgHover,
            };
        }
      };
      const tones = toneByStatus(status || { color: "info" });

      notification.open({
        message: null,
        description: (
          <div className="rev-toast-row">
            <div
              className="rev-toast-icon"
              style={{
                borderColor: tones.border,
                background: tones.iconBg,
              }}
            >
              {getNotificationIconComponent(latestNotification.type, tones.fg)}
            </div>
            <div className="rev-toast-text">
              <div className="rev-toast-title">
                <Typography.Text strong style={{ color: token.colorText }}>
                  {title}
                </Typography.Text>
                {status && <Tag color={status.color}>{status.text}</Tag>}
              </div>
              <Typography.Text style={{ color: token.colorTextSecondary }}>
                {latestNotification.message}
              </Typography.Text>
            </div>
          </div>
        ),
        duration: 4.5,
        placement: "topRight",
        style: {
          background: `color-mix(in srgb, ${tones.bg} 20%, #fff)`,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
          borderInlineStart: `6px solid ${tones.border}`,
          border: `1px solid ${token.colorSplit}`,
          maxWidth: 420,
          minWidth: 360,
        },
        className: "rev-toast",
        icon: null,
        onClick: () => {},
      });

      displayedNotificationsRef.current.add(latestNotification.id);
    }
  }, [
    notifications,
    notification,
    token.borderRadiusLG,
    token.borderRadiusRound,
    token.boxShadowSecondary,
    token.colorBgElevated,
    token.colorFillTertiary,
    token.colorTextSecondary,
    token.colorText,
    token.colorSplit,
    token.colorSuccess,
    token.colorSuccessBg,
    token.colorSuccessBgHover,
    token.colorError,
    token.colorErrorBg,
    token.colorErrorBgHover,
    token.colorWarning,
    token.colorWarningBg,
    token.colorWarningBgHover,
    token.colorInfo,
    token.colorInfoBg,
    token.colorInfoBgHover,
  ]);

  return null;
};

export default NotificationToast;
