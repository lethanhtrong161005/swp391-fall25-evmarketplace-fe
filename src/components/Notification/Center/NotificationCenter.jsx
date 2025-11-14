import React, { useState, useMemo, useRef, useCallback } from "react";
import { Badge, Popover, Button, Tooltip, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNotifications } from "@hooks/useNotifications";
import NotificationList from "../List/NotificationList";
import NotificationModal from "../Modal/NotificationModal";
import {
  getNotificationIcon,
  getNotificationColor,
} from "../notificationUtils";
import "../notification.scss";
import "./NotificationCenter.style.scss";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

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

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchNotifications(nextPage, 20, true); // append = true
      setPage(nextPage);

      // Update hasMore based on backend response
      if (result && typeof result.hasMore === "boolean") {
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    // Load more when user scrolls to bottom (with 50px threshold)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMore();
    }
  }, [loadMore, loading, hasMore]);

  // Reset page when tab changes or popover opens
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setHasMore(true);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      setPage(0);
      setHasMore(true);
    }
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
            onClick={() => handleTabChange("1")}
          >
            Tất cả
          </div>
          <div
            className={`notification-tab ${activeTab === "2" ? "active" : ""}`}
            onClick={() => handleTabChange("2")}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <div className="notification-badge">{unreadCount}</div>
            )}
          </div>
        </div>
      </div>

      <div
        className="notification-popover-body"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <NotificationList
          notifications={filteredNotifications}
          onNotificationClick={handleNotificationClick}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />

        {loading && (
          <div className="notification-loading">
            <Spin size="small" />
          </div>
        )}

        {!hasMore && notifications.length > 0 && (
          <div className="notification-end">Đã hiển thị tất cả thông báo</div>
        )}
      </div>
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
        onOpenChange={handleOpenChange}
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
