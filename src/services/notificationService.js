import SockJS from "sockjs-client";
import Stomp from "stompjs";
import cookieUtils from "@utils/cookieUtils";

// Polyfill for global in browser environment
if (typeof global === 'undefined') {
  window.global = window;
}

class NotificationService {
  constructor() {
    this.socket = null;
    this.client = null;
    this.isConnected = false;
    this.subscription = null;
    this.listeners = new Set();
    this.baseUrl = "http://localhost:8089";
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
      const queryString = `?token=${encodeURIComponent(token)}`;
      const wsUrl = `${this.baseUrl}${this.wsPath}${queryString}`;
      this.socket = new SockJS(wsUrl);
      this.client = Stomp.over(this.socket);
      this.client.debug = null;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.client.connect(
        headers,
        () => {
          this.isConnected = true;
          this.notifyListeners("connected", { message: "WebSocket connected" });

          this.subscription = this.client.subscribe(
            this.destination,
            (message) => {
              try {
                const notification = JSON.parse(message.body);
                this.notifyListeners("notification", notification);
              } catch {
                this.notifyListeners("rawMessage", message.body);
              }
            }
          );
        },
        () => {
          this.isConnected = false;
          this.notifyListeners("error", { message: "Connection failed" });
        }
      );
    } catch {
      this.notifyListeners("error", { message: "Setup failed" });
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
    } catch {
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

export default new NotificationService();
