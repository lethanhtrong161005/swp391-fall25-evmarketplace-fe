import SockJS from "sockjs-client";
import Stomp from "stompjs";
import cookieUtils from "@utils/cookieUtils";

// Polyfill for global in browser environment
if (typeof global === "undefined") {
  window.global = window;
}

class NotificationService {
  constructor() {
    this.socket = null;
    this.client = null;
    this.isConnected = false;
    this.subscription = null;
    this.listeners = new Set();
    this.baseUrl = ""; // Sử dụng proxy từ Vite
    this.wsPath = "/ws";
    this.destination = "/user/queue/notifications";
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
        // Silent error handling
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
      // Gắn token vào query để backend đọc trong handshake (giống ws-test.html)
      const queryString = `?token=${encodeURIComponent(token)}`;
      const wsUrl = `${this.baseUrl}${this.wsPath}${queryString}`;

      this.socket = new SockJS(wsUrl);
      this.client = Stomp.over(this.socket);
      this.client.debug = null;

      // Cấu hình heartbeat (giống ws-test.html)
      this.client.heartbeat.incoming = 20000;
      this.client.heartbeat.outgoing = 20000;

      // Gửi Authorization ở frame CONNECT (giống ws-test.html)
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.client.connect(
        headers,
        (frame) => {
          this.isConnected = true;
          this.notifyListeners("connected", {
            message: "WebSocket connected",
            headers: frame?.headers ? JSON.stringify(frame.headers) : "",
          });

          // Subscribe to notifications (giống ws-test.html)
          this.subscription = this.client.subscribe(
            this.destination,
            (message) => {
              try {
                const notification = JSON.parse(message.body);
                this.notifyListeners("notification", notification);
              } catch (error) {
                // Nếu không parse được JSON, gửi raw message
                this.notifyListeners("rawMessage", message.body);
              }
            }
          );

          this.notifyListeners("subscribed", { destination: this.destination });
        },
        (error) => {
          this.isConnected = false;
          this.notifyListeners("error", {
            message: "Connection failed",
            error: error.toString(),
          });
        }
      );
    } catch (error) {
      this.notifyListeners("error", {
        message: "Setup failed",
        error: error.toString(),
      });
    }
  }

  disconnect() {
    try {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      if (this.client && this.client.connected) {
        this.client.disconnect(() => {
          this.notifyListeners("disconnected", {
            message: "WebSocket disconnected",
          });
        });
      }
    } catch (error) {
      // Silent error handling
    } finally {
      this.client = null;
      this.socket = null;
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
        `/api/notification/${notificationId}`, // Sử dụng proxy
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getNotifications(token, page = 0, size = 20) {
    try {
      const response = await fetch(
        `/api/notification?page=${page}&size=${size}`, // Sử dụng proxy
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
    } catch (error) {
      return null;
    }
  }

  destroy() {
    this.disconnect();
    this.listeners.clear();
  }
}

export default new NotificationService();
