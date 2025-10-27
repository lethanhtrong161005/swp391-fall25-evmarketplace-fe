import React, { useState } from "react";
import {
  Badge,
  Popover,
  Button,
  Typography,
  Space,
  Tag,
  Empty,
  Tooltip,
  Card,
  Tabs,
  List,
  Avatar,
  Flex,
  Modal,
  Divider,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNotifications } from "@contexts/NotificationContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title } = Typography;

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LISTING_APPROVED":
        return <CheckCircleOutlined />;
      case "LISTING_REJECTED":
        return <CloseCircleOutlined />;
      case "LISTING_PENDING":
        return <ClockCircleOutlined />;
      case "LISTING_EXPIRED":
        return <ExclamationCircleOutlined />;
      case "LISTING_LIKED":
        return <HeartOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "LISTING_APPROVED":
        return "#52c41a";
      case "LISTING_REJECTED":
        return "#ff4d4f";
      case "LISTING_PENDING":
        return "#faad14";
      case "LISTING_EXPIRED":
        return "#fa8c16";
      case "LISTING_LIKED":
        return "#eb2f96";
      default:
        return "#1890ff";
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "LISTING_APPROVED":
        return "Tin đăng được duyệt";
      case "LISTING_REJECTED":
        return "Tin đăng bị từ chối";
      case "LISTING_PENDING":
        return "Tin đăng chờ duyệt";
      case "LISTING_EXPIRED":
        return "Tin đăng sắp hết hạn";
      case "LISTING_LIKED":
        return "Tin đăng được yêu thích";
      default:
        return "Thông báo mới";
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "2"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // 1. Set data for the modal
    setSelectedNotification(notification);

    // 2. Close the popover FIRST
    setIsOpen(false);

    // 3. Open the modal
    setIsModalVisible(true);

    // 4. Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const renderNotificationList = () => {
    if (filteredNotifications.length === 0) {
      return (
        <Empty
          image={<BellOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />}
          description="Không có thông báo nào"
          style={{ padding: "48px 24px" }}
        />
      );
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={filteredNotifications}
        renderItem={(notification) => (
          <List.Item
            key={notification.id}
            style={{
              padding: "16px 24px",
              cursor: "pointer",
              borderRadius: "0",
              margin: "0",
              transition: "all 0.2s ease",
              backgroundColor: !notification.isRead ? "#e6f7ff" : "transparent",
              borderLeft: !notification.isRead
                ? "3px solid #1890ff"
                : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f9ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = !notification.isRead
                ? "#e6f7ff"
                : "transparent";
            }}
            onClick={() => handleNotificationClick(notification)}
            actions={[
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add delete functionality here
                }}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={getNotificationIcon(notification.type)}
                  style={{
                    backgroundColor: getNotificationColor(notification.type),
                  }}
                />
              }
              title={
                <Text
                  strong
                  style={{
                    fontSize: "14px",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "280px",
                  }}
                >
                  {notification.message ||
                    getNotificationTitle(notification.type)}
                </Text>
              }
              description={
                <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {dayjs(notification.createdAt).fromNow()}
                  </Text>
                  {notification.referenceId && (
                    <Tag
                      size="small"
                      style={{
                        fontSize: "11px",
                        borderRadius: "6px",
                        background: "rgba(24, 144, 255, 0.1)",
                        color: "#1890ff",
                        border: "1px solid rgba(24, 144, 255, 0.2)",
                      }}
                    >
                      ID: {notification.referenceId}
                    </Tag>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const notificationContent = (
    <Card bodyStyle={{ padding: 0 }} style={{ width: 400, maxHeight: 500 }}>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
          Thông báo
        </Title>
        <Button
          type="link"
          size="small"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </Flex>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ margin: 0 }}
        centered
        items={[
          {
            key: "1",
            label: (
              <span>
                Tất cả <Badge count={notifications.length} offset={[8, 0]} />
              </span>
            ),
            children: renderNotificationList(),
          },
          {
            key: "2",
            label: (
              <span>
                Chưa đọc <Badge count={unreadCount} offset={[8, 0]} />
              </span>
            ),
            children: renderNotificationList(),
          },
        ]}
      />

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <Button type="primary" block>
            Xem tất cả thông báo
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              icon={
                selectedNotification &&
                getNotificationIcon(selectedNotification.type)
              }
              style={{
                backgroundColor:
                  selectedNotification &&
                  getNotificationColor(selectedNotification.type),
              }}
            />
            <Text strong style={{ fontSize: "16px" }}>
              {selectedNotification?.title ||
                selectedNotification?.message ||
                getNotificationTitle(selectedNotification?.type)}
            </Text>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width={600}
        destroyOnClose
      >
        {selectedNotification && (
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Loại thông báo:</Text>
                <br />
                <Tag
                  color={
                    selectedNotification.type === "LISTING_APPROVED"
                      ? "green"
                      : "red"
                  }
                  style={{ marginTop: 8 }}
                >
                  {getNotificationTitle(selectedNotification.type)}
                </Tag>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div>
                <Text strong>Thời gian:</Text>
                <br />
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", display: "block", marginTop: 4 }}
                >
                  {dayjs(selectedNotification.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}{" "}
                  ({dayjs(selectedNotification.createdAt).fromNow()})
                </Text>
              </div>

              {selectedNotification.type === "LISTING_REJECTED" && (
                <>
                  <Divider style={{ margin: "12px 0" }} />
                  <div>
                    <Text strong>Lý do từ chối:</Text>
                    <br />
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        display: "block",
                        marginTop: 8,
                        color: "#262626",
                      }}
                    >
                      {selectedNotification.rejectionReason ||
                        "Không có lý do cụ thể được cung cấp."}
                    </Text>
                  </div>
                </>
              )}
            </Space>
          </div>
        )}
      </Modal>

      <Popover
        content={notificationContent}
        title={null}
        trigger="click"
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        overlayStyle={{
          padding: 0,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
        overlayClassName="notification-popover"
      >
        <Tooltip
          title={
            unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Thông báo"
          }
          placement="bottom"
        >
          <div
            className="notification-bell-container"
            style={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            <Badge
              count={unreadCount}
              size="small"
              offset={[-4, 4]}
              style={{
                backgroundColor: unreadCount > 0 ? "#ff4d4f" : "transparent",
                boxShadow:
                  unreadCount > 0 ? "0 2px 8px rgba(255, 77, 79, 0.3)" : "none",
                animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
              }}
            >
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: unreadCount > 0 ? "#1890ff" : "#666",
                  background: "transparent",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                  e.currentTarget.style.color = "#1890ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color =
                    unreadCount > 0 ? "#1890ff" : "#666";
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
