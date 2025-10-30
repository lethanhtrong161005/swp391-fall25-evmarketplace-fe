import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Card, Typography, Button, Space, Divider, Pagination } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useNotifications } from "@hooks/useNotifications";
import NotificationList from "@components/Notification/List/NotificationList";
import NotificationModal from "@components/Notification/Modal/NotificationModal";
import {
  getNotificationIcon,
  getNotificationColor,
} from "@components/Notification/notificationUtils";
import "./NotificationPage.styles.scss";

const { Title, Text } = Typography;

const NotificationPage = () => {
  const {
    notifications,
    unreadCount,
    totalCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleNotificationClick = useCallback(
    async (notification) => {
      setSelectedNotification(notification);
      setIsModalVisible(true);
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
    },
    [markAsRead]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  // Fetch server-side page when currentPage changes
  useEffect(() => {
    fetchNotifications(currentPage - 1, pageSize);
  }, [currentPage, pageSize, fetchNotifications]);

  // const totalPages = Math.ceil(notifications.length / pageSize);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="notification-page">
      <div className="notification-page__container">
        <Card className="notification-page__card">
          <NotificationModal
            visible={isModalVisible}
            notification={selectedNotification}
            onClose={handleCloseModal}
          />
          <div className="notification-page__header">
            <div className="notification-page__title-section">
              <BellOutlined className="notification-page__icon" />
              <div>
                <Title level={2} className="notification-page__title">
                  Thông báo
                </Title>
                <Text type="secondary" className="notification-page__subtitle">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Tất cả thông báo đã được đọc"}
                </Text>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
                className="notification-page__mark-all-btn"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>

          <Divider className="notification-page__divider" />

          <div className="notification-page__content">
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
            />

            {totalCount > pageSize && (
              <div className="notification-page__pagination">
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} thông báo`
                  }
                  className="notification-pagination"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPage;
