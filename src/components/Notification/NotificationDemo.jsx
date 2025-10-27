import React, { useState } from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  Divider,
  Input,
  Select,
  message,
} from "antd";
import { useNotifications } from "@contexts/NotificationContext";
import {
  getNotificationColor,
  getNotificationTitle,
} from "@utils/notificationUtils";

const { Title, Text } = Typography;
const { Option } = Select;

const NotificationDemo = () => {
  const {
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    notifications,
  } = useNotifications();
  const [demoMessage, setDemoMessage] = useState(
    "Đây là thông báo demo từ hệ thống"
  );
  const [demoType, setDemoType] = useState("LISTING_APPROVED");

  const notificationTypes = [
    { value: "LISTING_APPROVED", label: "Tin đăng được duyệt" },
    { value: "LISTING_REJECTED", label: "Tin đăng bị từ chối" },
    { value: "LISTING_PENDING", label: "Tin đăng chờ duyệt" },
    { value: "LISTING_EXPIRED", label: "Tin đăng sắp hết hạn" },
    { value: "LISTING_LIKED", label: "Tin đăng được yêu thích" },
  ];

  const handleAddDemoNotification = () => {
    const newNotification = {
      id: `demo_${Date.now()}_${Math.random()}`,
      type: demoType,
      message: demoMessage,
      referenceId: `REF_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    addNotification(newNotification);
    message.success("Đã thêm thông báo demo!");
  };

  const handleAddRandomNotification = () => {
    const randomType =
      notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
        .value;
    const randomMessages = [
      "Xe điện Tesla Model 3 của bạn đã được duyệt và hiển thị trên trang chủ",
      "Tin đăng về pin lithium-ion đã bị từ chối do thông tin không chính xác",
      "Tin đăng xe máy điện VinFast đang chờ kiểm duyệt",
      "Tin đăng về bộ sạc nhanh sắp hết hạn trong 3 ngày",
      "Tin đăng xe đạp điện đã được 5 người yêu thích",
    ];

    const newNotification = {
      id: `random_${Date.now()}_${Math.random()}`,
      type: randomType,
      message:
        randomMessages[Math.floor(Math.random() * randomMessages.length)],
      referenceId: `REF_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    addNotification(newNotification);
    message.success("Đã thêm thông báo ngẫu nhiên!");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>🔔 Demo Hệ thống Thông báo</Title>

      <Card title="Tạo thông báo demo" style={{ marginBottom: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Loại thông báo:</Text>
            <Select
              value={demoType}
              onChange={setDemoType}
              style={{ width: "100%", marginTop: "8px" }}
            >
              {notificationTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  <span style={{ color: getNotificationColor(type.value) }}>
                    {type.label}
                  </span>
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Nội dung thông báo:</Text>
            <Input.TextArea
              value={demoMessage}
              onChange={(e) => setDemoMessage(e.target.value)}
              rows={3}
              style={{ marginTop: "8px" }}
              placeholder="Nhập nội dung thông báo..."
            />
          </div>

          <Space>
            <Button type="primary" onClick={handleAddDemoNotification}>
              Thêm thông báo demo
            </Button>
            <Button onClick={handleAddRandomNotification}>
              Thêm thông báo ngẫu nhiên
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Quản lý thông báo" style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Button onClick={markAllAsRead}>Đánh dấu tất cả đã đọc</Button>
          <Button danger onClick={clearAllNotifications}>
            Xóa tất cả thông báo
          </Button>
        </Space>
      </Card>

      <Card title={`Danh sách thông báo (${notifications.length})`}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            <Text>Chưa có thông báo nào</Text>
          </div>
        ) : (
          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  style={{
                    padding: "12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    background: notification.isRead ? "#fafafa" : "#f0f8ff",
                    borderLeft: `4px solid ${getNotificationColor(
                      notification.type
                    )}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            color: getNotificationColor(notification.type),
                          }}
                        >
                          {getNotificationTitle(notification.type)}
                        </Text>
                        {!notification.isRead && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: getNotificationColor(
                                notification.type
                              ),
                            }}
                          />
                        )}
                      </div>
                      <Text style={{ display: "block", marginBottom: "4px" }}>
                        {notification.message}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        ID: {notification.referenceId} •{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                      </Text>
                    </div>
                    <div>
                      {!notification.isRead && (
                        <Button
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Divider style={{ margin: "8px 0" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationDemo;
