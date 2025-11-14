import React, { useEffect, useState, useCallback, useRef } from "react";
import { List, Avatar, Empty, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { getConversations } from "@services/chatService";
import { useAuth } from "@contexts/AuthContext";
import { getAccountDbId, normalizeUserId, getOtherParticipant } from "@utils/chatUtils";
import s from "./ConversationList.module.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ConversationList = ({
  selectedConversationId = null,
  onSelectConversation,
  loading = false,
  refreshTrigger = null,
  currentUserId: propCurrentUserId = null,
  searchQuery = "",
  filterUnread = false,
}) => {
  const { user } = useAuth();
  const currentUserId = propCurrentUserId || getAccountDbId(user);
  const [conversations, setConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const loadConversationsRef = useRef(null);

  const loadConversations = useCallback(async (retryCount = 0) => {
    if (!user && retryCount < 4) {
      console.log(`[ConversationList] Waiting for user to load (retry ${retryCount + 1}/4)...`);
      setTimeout(() => {
        loadConversations(retryCount + 1);
      }, 500);
      return;
    }

    if (!user) {
      console.log("[ConversationList] Skipping load - no user data after retries");
      return;
    }

    try {
      setLoadingConversations(true);
      console.log("[ConversationList] Loading conversations for user:", currentUserId, "user object:", user);
      const res = await getConversations(0, 50);
      console.log("[ConversationList] getConversations response:", JSON.stringify(res, null, 2));
      console.log("[ConversationList] Response type:", typeof res);
      console.log("[ConversationList] Response keys:", res ? Object.keys(res) : "null");
      
      let items = [];
      
      if (res?.success && res?.data) {
        items = res.data.content || res.data.items || res.data || [];
      } else if (Array.isArray(res)) {
        items = res;
      } else if (res?.content || res?.items) {
        items = res.content || res.items || [];
      } else if (res?.data) {
        items = Array.isArray(res.data) ? res.data : (res.data.content || res.data.items || []);
      }
      
      console.log("[ConversationList] Loaded conversations count:", items.length);
      
      setAllConversations(items);
      
      let filteredItems = items;
      
      if (searchQuery && searchQuery.length >= 3) {
        const query = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter((conv) => {
          const otherParticipant = getOtherParticipant(conv, currentUserId) || {};
          const name = (otherParticipant.name || otherParticipant.fullName || "").toLowerCase();
          const lastMessage = (conv?.lastMessage?.textContent || "").toLowerCase();
          return name.includes(query) || lastMessage.includes(query);
        });
      }
      
      if (filterUnread) {
        filteredItems = filteredItems.filter((conv) => {
          const unreadCount = conv?.unreadCount || 0;
          return unreadCount > 0;
        });
      }
      
      if (filteredItems.length > 0) {
        filteredItems.forEach((conv, idx) => {
          const otherParticipant = getOtherParticipant(conv, currentUserId);
          console.log(`[ConversationList] Conversation ${idx}:`, {
            id: conv.id,
            userAId: conv.userA?.id || conv.userAId,
            userBId: conv.userB?.id || conv.userBId,
            otherParticipant: otherParticipant ? {
              id: otherParticipant.id,
              name: otherParticipant.name,
              fullName: otherParticipant.fullName,
            } : null,
            lastMessage: conv.lastMessage?.textContent,
          });
        });
        setConversations(filteredItems);
      } else {
        console.warn("[ConversationList] No conversations found. Response structure:", {
          hasSuccess: res?.success !== undefined,
          hasData: !!res?.data,
          isArray: Array.isArray(res),
          responseKeys: res ? Object.keys(res) : null,
        });
        if (res && (res.success !== undefined || Array.isArray(res) || res.content !== undefined || res.items !== undefined)) {
          setConversations([]);
          setAllConversations([]);
        }
      }
    } catch (e) {
      console.error("[ConversationList] Load conversations error:", e);
      console.error("[ConversationList] Error stack:", e.stack);
      console.error("[ConversationList] Error message:", e.message);
      console.error("[ConversationList] Error response:", e.response);
      
      if (e.response || e.message?.includes('InvalidDataAccessApiUsageException') || e.message?.includes('Sort expression')) {
        console.error("[ConversationList] Backend error detected - this is a backend issue, not frontend");
      }
    } finally {
      setLoadingConversations(false);
    }
  }, [user, currentUserId, searchQuery, filterUnread]);

  // Keep ref updated with latest loadConversations function
  useEffect(() => {
    loadConversationsRef.current = loadConversations;
  }, [loadConversations]);

  useEffect(() => {
    console.log("[ConversationList] Component mounted or user changed, loading conversations...", {
      hasUser: !!user,
      currentUserId,
      hasLoadedOnce,
    });
    
    // Only load once when user is available and hasn't loaded yet
    if (!hasLoadedOnce && user && currentUserId) {
      console.log("[ConversationList] Initial load triggered");
      loadConversations();
      setHasLoadedOnce(true);
    }
  }, [user, currentUserId, hasLoadedOnce]); // Added currentUserId to ensure we have valid user ID

  useEffect(() => {
    if (refreshTrigger !== null && refreshTrigger > 0 && user) {
      console.log("[ConversationList] Refresh triggered:", refreshTrigger);
      loadConversations();
    }
  }, [refreshTrigger, user]); // Removed loadConversations from deps
  
  useEffect(() => {
      if (allConversations.length > 0) {
        let filteredItems = [...allConversations];
        
        if (searchQuery && searchQuery.length >= 3) {
          const query = searchQuery.toLowerCase();
          filteredItems = filteredItems.filter((conv) => {
            const otherParticipant = getOtherParticipant(conv, currentUserId) || {};
            const name = (otherParticipant.name || otherParticipant.fullName || "").toLowerCase();
            const lastMessage = (conv?.lastMessage?.textContent || "").toLowerCase();
            return name.includes(query) || lastMessage.includes(query);
          });
        }
      
      if (filterUnread) {
        filteredItems = filteredItems.filter((conv) => {
          const unreadCount = conv?.unreadCount || 0;
          return unreadCount > 0;
        });
      }
      
      setConversations(filteredItems);
    }
  }, [searchQuery, filterUnread, allConversations]);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    const interval = setInterval(() => {
      console.log("[ConversationList] Auto-refreshing conversation list...");
      if (loadConversationsRef.current) {
        loadConversationsRef.current();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, currentUserId]); // Removed loadConversations from deps

  useEffect(() => {
    if (!user) return;
    
    let refreshTimeout = null;
    
    const handleMessageReceived = (event) => {
      console.log("[ConversationList] Chat message received event:", event.detail);
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (loadConversationsRef.current) {
          loadConversationsRef.current();
        }
      }, 500);
    };

    const handleMessageSent = (event) => {
      console.log("[ConversationList] Chat message sent event:", event.detail);
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (loadConversationsRef.current) {
          loadConversationsRef.current();
        }
      }, 300);
    };

    window.addEventListener('chat-message-received', handleMessageReceived);
    window.addEventListener('chat-message-sent', handleMessageSent);
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener('chat-message-received', handleMessageReceived);
      window.removeEventListener('chat-message-sent', handleMessageSent);
    };
  }, [user]); // Removed loadConversations from deps - use closure to access latest function

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = dayjs(timestamp);
    const now = dayjs();
    
    if (date.isSame(now, "day")) {
      return date.format("HH:mm");
    } else if (date.isSame(now.subtract(1, "day"), "day")) {
      return "Hôm qua";
    } else if (date.isAfter(now.subtract(7, "day"))) {
      return date.format("dddd");
    } else {
      return date.format("DD/MM/YYYY");
    }
  };

  const getLastMessagePreview = (conversation) => {
    const lastMessage = conversation?.lastMessage;
    
    if (!lastMessage && conversation?.lastMessageId) {
      return "Có tin nhắn";
    }
    
    if (!lastMessage) {
      return "Chưa có tin nhắn";
    }
    
    const type = lastMessage?.type?.toUpperCase();
    if (type === "IMAGE") return "📷 Ảnh";
    if (type === "VIDEO") return "🎥 Video";
    const text = lastMessage?.textContent || lastMessage?.content || "";
    return text || "Tin nhắn";
  };

  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}/api/accounts/image/${filename}/avatar`;
  };

  if (loadingConversations) {
    return (
      <div className={s.conversationList}>
        <div className={s.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={s.conversationList}>
        <Empty
          description="Chưa có cuộc trò chuyện nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={s.conversationList}>
      <List
        dataSource={conversations}
        renderItem={(conversation, index) => {
          const otherParticipant = getOtherParticipant(conversation, currentUserId) || {};
          const recipientId = normalizeUserId(otherParticipant?.id);
          const recipientName = otherParticipant?.fullName || otherParticipant?.name || (recipientId ? `User ${recipientId}` : "Người dùng");
          // Use avatarUrl directly if available, otherwise try to extract from avatarFilename
          const recipientAvatar = otherParticipant?.avatarUrl || getAvatarUrl(otherParticipant?.avatarFilename);
          const unreadCount = conversation?.unreadCount || 0;
          const isSelected = conversation?.id === selectedConversationId;
          const lastMessageTime = conversation?.lastMessage?.createdAt 
            || conversation?.lastMessageAt 
            || conversation?.updatedAt 
            || conversation?.createdAt;
          // Use conversation.id as primary key, with fallback to ensure uniqueness
          const itemKey = conversation?.id ? `conv-${conversation.id}` : `conv-fallback-${recipientId || 'unknown'}-${index}`;

          return (
            <List.Item
              key={itemKey}
              className={`${s.conversationItem} ${isSelected ? s.selected : ""}`}
              onClick={() => onSelectConversation?.(conversation.id, recipientId, otherParticipant)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={recipientAvatar}
                    icon={!recipientAvatar && <UserOutlined />}
                    size={48}
                    style={{ flexShrink: 0 }}
                  />
                }
                title={
                  <div className={s.conversationTitle}>
                    <span className={s.recipientName}>{recipientName}</span>
                    {lastMessageTime && (
                      <span className={s.time}>{formatTime(lastMessageTime)}</span>
                    )}
                  </div>
                }
                description={
                  <div className={s.conversationDescription}>
                    <span className={s.lastMessage}>
                      {getLastMessagePreview(conversation)}
                    </span>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ConversationList;

