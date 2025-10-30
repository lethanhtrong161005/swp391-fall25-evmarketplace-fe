import SockJS from "sockjs-client";
import Stomp from "stompjs";

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
      } catch {
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
              } catch {
                // Nếu không parse được JSON, gửi raw message
                this.notifyListeners("rawMessage", message.body);
              }
            }
          );

          this.notifyListeners("subscribed", { destination: this.destination });
        },
        () => {
          this.isConnected = false;
          this.notifyListeners("error", {
            message: "Connection failed",
            error: "connection_failed",
          });
        }
      );
    } catch {
      this.notifyListeners("error", {
        message: "Setup failed",
        error: "setup_failed",
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
    } catch {
      return false;
    }
  }

  async getNotifications(token, page = 0, size = 20) {
    try {
      const url = `/api/notification?page=${page}&size=${size}`;
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.debug("[NotificationService] GET", url);
      }

      const response = await fetch(
        url, // Sử dụng proxy
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
        if (import.meta && import.meta.env && import.meta.env.DEV) {
          console.debug("[NotificationService] Response shape:", {
            keys: Object.keys(data || {}),
            dataPreview: JSON.stringify(data).slice(0, 500) + "...",
          });
        }
        const headerTotal =
          response.headers.get("X-Total-Count") ||
          response.headers.get("x-total-count") ||
          response.headers.get("X-Total") ||
          response.headers.get("x-total") ||
          null;

        // Normalize Page or Slice payloads to a common shape
        const d = data && data.data ? data.data : data;

        // Items: common fields
        const items =
          d?.items || d?.content || d?.data?.items || d?.data?.content || [];

        // Resolve total for Page; may be in body or via headers; Slice usually lacks total
        const bodyTotal =
          d?.total ||
          d?.totalItems ||
          d?.totalElements ||
          d?.page?.totalElements ||
          d?.metadata?.total ||
          null;

        const normalized = {
          items,
          total:
            headerTotal !== null
              ? Number(headerTotal)
              : bodyTotal !== null
              ? Number(bodyTotal)
              : null, // null when Slice (no total)
          hasNext:
            typeof d?.hasNext === "boolean"
              ? d.hasNext
              : typeof d?.last === "boolean"
              ? !d.last
              : typeof d?.numberOfElements === "number"
              ? d.numberOfElements === size
              : null,
          page:
            typeof d?.page === "number"
              ? d.page
              : typeof d?.number === "number"
              ? d.number
              : page,
          size:
            typeof d?.size === "number" ? d.size : size,
        };

        return normalized;
      }
      return null;
    } catch {
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.debug("[NotificationService] Error during fetch");
      }
      return null;
    }
  }

  destroy() {
    this.disconnect();
    this.listeners.clear();
  }
}

export default new NotificationService();
