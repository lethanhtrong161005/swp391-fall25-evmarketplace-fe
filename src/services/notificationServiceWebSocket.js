import cookieUtils from "@utils/cookieUtils";

class NotificationServiceWebSocket {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Set();
    this.baseUrl = ""; // Sử dụng proxy từ Vite
    this.wsPath = "/ws";
    this.destination = "/user/queue/notifications";
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
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
      // Sử dụng WebSocket native với proxy
      const wsUrl = `ws://localhost:5173/ws?token=${encodeURIComponent(token)}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners("connected", { message: "WebSocket connected" });
        
        // Gửi subscription message
        this.socket.send(JSON.stringify({
          command: "SUBSCRIBE",
          destination: this.destination,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            this.notifyListeners("notification", data);
          }
        } catch (error) {
          this.notifyListeners("rawMessage", event.data);
        }
      };

      this.socket.onclose = (event) => {
        this.isConnected = false;
        this.notifyListeners("disconnected", { message: "WebSocket disconnected" });
        
        // Auto reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(token);
          }, this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        this.isConnected = false;
        this.notifyListeners("error", { message: "WebSocket error", error });
      };

    } catch (error) {
      this.notifyListeners("error", { message: "Setup failed", error });
    }
  }

  disconnect() {
    try {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      type: "websocket",
      destination: this.destination,
    };
  }

  async markAsRead(notificationId, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/notification/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async getNotifications(token, page = 0, size = 20) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/notification?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch {
      return null;
    }
  }

  destroy() {
    this.disconnect();
    this.listeners.clear();
  }
}

export default new NotificationServiceWebSocket();
