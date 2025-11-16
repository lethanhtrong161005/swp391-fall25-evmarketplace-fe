import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useAuth } from "@contexts/AuthContext";
import cookieUtils from "@utils/cookieUtils";
import config from "@config";
import {
  openConversation,
  sendText as sendTextAPI,
  sendMedia as sendMediaAPI,
  loadMessages as loadMessagesAPI,
  markSeen as markSeenAPI,
} from "@services/chatService";
// Note: message.error will be handled by components using App.useApp()

/**
 * Custom hook for managing chat WebSocket connection and messages
 * @param {number|null} conversationId - Current conversation ID
 * @param {number|string|null} recipientId - Recipient user ID (for opening conversation)
 * @returns {object} Chat state and methods
 */
export const useChat = (conversationId = null, recipientId = null) => {
  const { user, isLoggedIn } = useAuth();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    // Only attempt connect once per session; guard by current connected flag
    if (!isLoggedIn || connected) return;

    const token = cookieUtils.getToken();
    if (!token) {
      setError("Không tìm thấy token đăng nhập");
      return;
    }

    try {
      const wsUrl = `${config.publicRuntime.API_URL}/ws?token=${encodeURIComponent(token)}`;
      const socketFactory = () => new SockJS(wsUrl);
      const client = Stomp.over(socketFactory);

      // Disable debug logs in production
      client.debug = () => {};

      // Configure heartbeat
      client.heartbeatIncoming = 10000;
      client.heartbeatOutgoing = 10000;

      // Configure reconnect delay
      client.reconnectDelay = 5000;

      client.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          setConnected(true);
          setError(null);
          stompClientRef.current = client;
        },
        (err) => {
          setConnected(false);
          setError("Không thể kết nối WebSocket");
          console.error("WebSocket connection error:", err);
        }
      );
    } catch (e) {
      setError("Lỗi khởi tạo WebSocket");
      console.error("WebSocket setup error:", e);
    }
  }, [isLoggedIn]);

  // Subscribe to conversation
  const subscribeToConversation = useCallback((cid, client = null) => {
    const clientToUse = client || stompClientRef.current;
    if (!clientToUse || !cid) {
      console.warn("[useChat] subscribeToConversation: missing client or cid", { client: !!clientToUse, cid });
      return;
    }

    // Unsubscribe from previous conversation
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        // Ignore unsubscribe errors
        console.warn("[useChat] Error unsubscribing:", e);
      }
    }

    const queueDest = `/user/queue/chat/${cid}`;
    
    subscriptionRef.current = clientToUse.subscribe(queueDest, (frame) => {
      try {
        const data = JSON.parse(frame.body);
        
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some((msg) => msg.id === data.id);
          if (exists) {
            return prev;
          }
          return [...prev, data];
        });
        
        // Emit custom event to notify ConversationList to refresh
        // This ensures conversation list updates when receiving messages
        // MessageList component will handle auto-scroll based on user's scroll position
        window.dispatchEvent(new CustomEvent('chat-message-received', {
          detail: { conversationId: cid, message: data }
        }));
      } catch (e) {
        console.error("[useChat] Parse message error:", e, frame);
      }
    });
  }, []);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        // Ignore errors
      }
      subscriptionRef.current = null;
    }

    if (stompClientRef.current) {
      try {
        stompClientRef.current.disconnect();
      } catch (e) {
        // Ignore errors
      }
      stompClientRef.current = null;
    }

    setConnected(false);
  }, []);

  // Open conversation
  const openConversationWithUser = useCallback(async (otherId, listingId = null) => {
    if (!otherId) {
      setError("Thiếu thông tin người nhận");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure otherId is a number
      const normalizedOtherId = typeof otherId === 'number' ? otherId : parseInt(otherId);
      if (isNaN(normalizedOtherId)) {
        throw new Error("Invalid otherId: " + otherId);
      }
      
      // Normalize listingId if provided
      let normalizedListingId = null;
      if (listingId != null) {
        normalizedListingId = typeof listingId === 'number' ? listingId : parseInt(listingId);
        if (isNaN(normalizedListingId)) {
          console.warn("[useChat] Invalid listingId provided, ignoring:", listingId);
          normalizedListingId = null;
        }
      }
      
      const res = await openConversation(normalizedOtherId, normalizedListingId);
      
      // Handle different response formats:
      // 1. { success: true, data: { id: ... } } - wrapped response
      // 2. { id: ... } - direct response (like chatapp_frontend)
      let conversationData = null;
      let cid = null;
      
      if (res?.success && res?.data?.id) {
        // Wrapped response format
        cid = res.data.id;
        conversationData = res.data;
      } else if (res?.id) {
        // Direct response format (like chatapp_frontend)
        cid = res.id;
        conversationData = res;
      } else if (res?.data?.id) {
        // Another possible format
        cid = res.data.id;
        conversationData = res.data;
      } else {
        throw new Error(res?.message || res?.error || "Không thể mở cuộc trò chuyện");
      }
      
      if (cid) {
        setCurrentConversationId(cid);
        setMessages([]);

        // Subscription will be handled by the useEffect watching currentConversationId

        // Return conversation data including otherParticipant if available
        return { id: cid, ...conversationData };
      } else {
        throw new Error("Không nhận được conversation ID từ server");
      }
    } catch (e) {
      const errorMsg = e?.message || "Lỗi khi mở cuộc trò chuyện";
      setError(errorMsg);
      // Log error only once to avoid duplicate logs
      // Error is already handled by ChatPage, so we don't need to log here
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, subscribeToConversation]);

  // Load message history
  const loadMessageHistory = useCallback(async (cid, page = 0, size = 20) => {
    if (!cid) {
      console.warn("[useChat] loadMessageHistory: no conversationId provided");
      return;
    }

    try {
      setLoading(true);
      const res = await loadMessagesAPI(cid, page, size);
      
      let items = [];
      
      // Handle different response formats
      if (res?.success && res?.data) {
        // Wrapped response format: { success: true, data: { content: [...] } }
        items = res.data.content || res.data.items || res.data || [];
      } else if (Array.isArray(res)) {
        // Direct array response
        items = res;
      } else if (res?.content || res?.items) {
        // Response with content/items at root
        items = res.content || res.items || [];
      } else if (res?.data) {
        // Response with data at root
        items = Array.isArray(res.data) ? res.data : (res.data.content || res.data.items || []);
      }
      
      if (items.length > 0) {
        // Reverse to show oldest first, then newest
        const reversed = items.slice().reverse();
        setMessages(reversed);
        
        // Don't auto-scroll here - let MessageList component handle it
        // This prevents unwanted scroll when page loads
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error("[useChat] Load messages error:", e);
      setError("Không thể tải tin nhắn");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send text message
  const sendText = useCallback(async (text, cid = null, recipientIdParam = null) => {
    const cidToUse = cid || currentConversationId;
    const recipientIdToUse = recipientIdParam || recipientId;

    if (!cidToUse || !recipientIdToUse || !text?.trim()) {
      const errorMsg = "Thiếu thông tin để gửi tin nhắn";
      setError(errorMsg);
      console.error("[useChat] sendText validation failed:", {
        cidToUse,
        recipientIdToUse,
        hasText: !!text?.trim(),
      });
      return;
    }

    try {
      // Ensure recipientId is a number for API call
      const normalizedRecipientId = typeof recipientIdToUse === 'number' 
        ? recipientIdToUse 
        : parseInt(recipientIdToUse);
      
      if (isNaN(normalizedRecipientId)) {
        throw new Error("Invalid recipientId: " + recipientIdToUse);
      }
      
      await sendTextAPI(cidToUse, normalizedRecipientId, text.trim());
      
      // Emit event to refresh conversation list after sending message
      // This ensures the conversation list shows the latest message and updates properly
      window.dispatchEvent(new CustomEvent('chat-message-sent', {
        detail: { conversationId: cidToUse, text: text.trim() }
      }));
    } catch (e) {
      const errorMsg = e?.message || "Không thể gửi tin nhắn";
      setError(errorMsg);
      console.error("[useChat] Send text error:", errorMsg, e);
    }
  }, [currentConversationId, recipientId]);

  // Send media message
  const sendMedia = useCallback(async (file, type, cid = null, recipientIdParam = null) => {
    const cidToUse = cid || currentConversationId;
    const recipientIdToUse = recipientIdParam || recipientId;

    if (!cidToUse || !recipientIdToUse || !file) {
      const errorMsg = "Thiếu thông tin để gửi file";
      setError(errorMsg);
      console.error("[useChat] sendMedia validation failed:", {
        cidToUse,
        recipientIdToUse,
        hasFile: !!file,
      });
      return;
    }

    if (type !== "IMAGE" && type !== "VIDEO") {
      const errorMsg = "Loại file không hợp lệ";
      setError(errorMsg);
      return;
    }

    // Validate file size
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    if (type === "IMAGE" && file.size > MAX_IMAGE_SIZE) {
      const errorMsg = `Kích thước ảnh không được vượt quá ${formatFileSize(MAX_IMAGE_SIZE)}. File của bạn: ${formatFileSize(file.size)}`;
      setError(errorMsg);
      console.error("[useChat] Image size exceeds limit:", {
        fileSize: file.size,
        maxSize: MAX_IMAGE_SIZE,
        formattedSize: formatFileSize(file.size),
        maxFormattedSize: formatFileSize(MAX_IMAGE_SIZE),
      });
      return;
    }

    if (type === "VIDEO" && file.size > MAX_VIDEO_SIZE) {
      const errorMsg = `Dung lượng video không được vượt quá ${formatFileSize(MAX_VIDEO_SIZE)}. File của bạn: ${formatFileSize(file.size)}`;
      setError(errorMsg);
      console.error("[useChat] Video size exceeds limit:", {
        fileSize: file.size,
        maxSize: MAX_VIDEO_SIZE,
        formattedSize: formatFileSize(file.size),
        maxFormattedSize: formatFileSize(MAX_VIDEO_SIZE),
      });
      return;
    }

    try {
      // Ensure recipientId is a number for API call
      const normalizedRecipientId = typeof recipientIdToUse === 'number' 
        ? recipientIdToUse 
        : parseInt(recipientIdToUse);
      
      if (isNaN(normalizedRecipientId)) {
        throw new Error("Invalid recipientId: " + recipientIdToUse);
      }
      
      await sendMediaAPI(cidToUse, normalizedRecipientId, file, type);
    } catch (e) {
      const errorMsg = e?.message || "Không thể gửi file";
      setError(errorMsg);
      console.error("[useChat] Send media error:", errorMsg, e);
    }
  }, [currentConversationId, recipientId]);

  // Mark conversation as seen
  const markConversationSeen = useCallback(async (cid = null) => {
    const cidToUse = cid || currentConversationId;
    if (!cidToUse) return;

    try {
      await markSeenAPI(cidToUse);
    } catch (e) {
      console.error("Mark seen error:", e);
    }
  }, [currentConversationId]);

  // Initialize: connect WebSocket when logged in
  useEffect(() => {
    if (isLoggedIn && !connected) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isLoggedIn]);

  // Subscribe when conversationId changes
  useEffect(() => {
    if (connected && currentConversationId && stompClientRef.current) {
      subscribeToConversation(currentConversationId, stompClientRef.current);
      loadMessageHistory(currentConversationId);
      markConversationSeen(currentConversationId);
    }
  }, [connected, currentConversationId, subscribeToConversation, loadMessageHistory, markConversationSeen]);

  // Note: Auto-opening conversation is handled by ChatPage component
  // This useEffect was removed to prevent duplicate calls

  return {
    connected,
    messages,
    loading,
    error,
    currentConversationId,
    messagesEndRef,
    connectWebSocket,
    disconnectWebSocket,
    openConversationWithUser,
    loadMessageHistory,
    sendText,
    sendMedia,
    markConversationSeen,
    setCurrentConversationId,
    setMessages,
    subscribeToConversation, // Export for external use if needed
  };
};

