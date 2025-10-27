import cookieUtils from "@utils/cookieUtils";

class NotificationServiceMock {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Set();
    this.baseUrl = "";
    this.wsPath = "/ws";
    this.destination = "/user/queue/notifications";
    this.mockInterval = null;
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach((callback) => {
      try {
        if (typeof callback === "function") {
          callback(event, data);
        }
      } catch (error) {
        console.error("Error in notification listener:", error);
      }
    });
  }

  async connect(token) {
    if (this.isConnected) return;

    if (!token) {
      this.notifyListeners("error", { message: "No token" });
      return;
    }

    try {
      // Mock connection - không cần WebSocket thật
      setTimeout(() => {
        this.isConnected = true;
        this.notifyListeners("connected", {
          message: "Mock service connected (no WebSocket needed)",
        });

        // Start sending mock notifications
        this.startMockNotifications();
      }, 1000);
    } catch (error) {
      this.notifyListeners("error", { message: "Setup failed", error });
    }
  }

  startMockNotifications() {
    // Send mock notifications every 10 seconds
    this.mockInterval = setInterval(() => {
      const mockNotifications = [
        {
          id: `mock_${Date.now()}_${Math.random()}`,
          type: "LISTING_APPROVED",
          message:
            "Tin đăng xe điện Tesla Model 3 của bạn đã được duyệt và hiển thị trên trang chủ",
          referenceId: `REF_${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        {
          id: `mock_${Date.now()}_${Math.random()}`,
          type: "LISTING_LIKED",
          message: "Tin đăng xe máy điện VinFast đã được 3 người yêu thích",
          referenceId: `REF_${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        {
          id: `mock_${Date.now()}_${Math.random()}`,
          type: "LISTING_EXPIRED",
          message: "Tin đăng về pin lithium-ion sắp hết hạn trong 2 ngày",
          referenceId: `REF_${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ];

      const randomNotification =
        mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      this.notifyListeners("notification", randomNotification);
    }, 10000); // 10 seconds
  }

  disconnect() {
    try {
      if (this.mockInterval) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      this.isConnected = false;
      this.notifyListeners("disconnected", {
        message: "Mock WebSocket disconnected",
      });
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      type: "mock-service",
      destination: "No WebSocket needed - using mock data",
    };
  }

  async markAsRead(notificationId, token) {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock: Marked notification ${notificationId} as read`);
        resolve(true);
      }, 500);
    });
  }

  async getNotifications(token, page = 0, size = 20) {
    // Mock API response
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          data: {
            items: [
              {
                id: "mock_1",
                type: "LISTING_APPROVED",
                message: "Tin đăng xe điện đã được duyệt",
                referenceId: "REF_001",
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                isRead: false,
              },
              {
                id: "mock_2",
                type: "LISTING_LIKED",
                message: "Tin đăng được yêu thích",
                referenceId: "REF_002",
                createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                isRead: true,
              },
            ],
            total: 2,
            page: 0,
            size: 20,
          },
        };
        resolve(mockData);
      }, 1000);
    });
  }

  destroy() {
    this.disconnect();
    this.listeners.clear();
  }
}

export default new NotificationServiceMock();
