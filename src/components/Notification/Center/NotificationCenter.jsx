import React, { useState, useMemo } from "react";
import { Badge, Popover, Button, Tooltip } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@hooks/useNotifications";
import NotificationList from "../List/NotificationList";
import NotificationModal from "../Modal/NotificationModal";
import {
  getNotificationIcon,
  getNotificationColor,
} from "../notificationUtils";
import "./NotificationCenter.style.scss";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const filteredNotifications = useMemo(() => {
    return activeTab === "2"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;
  }, [notifications, activeTab]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsOpen(false);
    setIsModalVisible(true);

    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const handleViewAllNotifications = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  const notificationContent = (
    <div className="notification-popover-container">
      <div className="notification-popover-header">
        <div className="notification-popover-title">Thông báo</div>
        <Button
          type="link"
          size="small"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="mark-all-read-button"
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div className="notification-popover-tabs">
        <div className="notification-popover-tabs-wrapper">
          <div
            className={`notification-tab ${activeTab === "1" ? "active" : ""}`}
            onClick={() => setActiveTab("1")}
          >
            Tất cả
          </div>
          <div
            className={`notification-tab ${activeTab === "2" ? "active" : ""}`}
            onClick={() => setActiveTab("2")}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <div className="notification-badge">{unreadCount}</div>
            )}
          </div>
        </div>
      </div>

      <div className="notification-popover-body">
        <NotificationList
          notifications={filteredNotifications.slice(0, 10)}
          onNotificationClick={handleNotificationClick}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />
      </div>

      {notifications.length > 0 && (
        <div className="notification-popover-footer">
          <Button
            type="primary"
            block
            className="notification-button"
            onClick={handleViewAllNotifications}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <NotificationModal
        visible={isModalVisible}
        notification={selectedNotification}
        onClose={handleCloseModal}
      />

      <Popover
        content={notificationContent}
        title={null}
        trigger="click"
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="bottomRight"
        arrow={false}
        overlayClassName="notification-popover"
      >
        <Tooltip
          title={
            unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Thông báo"
          }
          placement="bottom"
        >
          <div className="notification-bell-container">
            <Badge
              count={unreadCount}
              size="small"
              offset={[-4, 4]}
              className={unreadCount > 0 ? "badge-pulse" : ""}
            >
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: "18px" }} />}
                className="notification-bell-button"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Badge>
          </div>
        </Tooltip>
      </Popover>
    </>
  );
};

export default NotificationCenter;
