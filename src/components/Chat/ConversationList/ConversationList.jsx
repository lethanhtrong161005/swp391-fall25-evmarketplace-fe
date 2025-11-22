import React, { useEffect, useState, useCallback, useRef } from "react";
import { List, Avatar, Empty, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { getConversations } from "@services/chatService";
import { useAuth } from "@contexts/AuthContext";
import {
  getAccountDbId,
  normalizeUserId,
  getOtherParticipant,
} from "@utils/chatUtils";
import s from "./ConversationList.module.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ConversationList = ({
  selectedConversationId = null,
  onSelectConversation,
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

  // Tải danh sách cuộc trò chuyện từ API và áp dụng filter tìm kiếm/unread
  const loadConversations = useCallback(
    async (retryCount = 0) => {
      if (!user && retryCount < 4) {
        setTimeout(() => {
          loadConversations(retryCount + 1);
        }, 500);
        return;
      }

      if (!user) {
        return;
      }

      try {
        setLoadingConversations(true);
        const res = await getConversations(0, 50);

        let items = [];

        if (res?.success && res?.data) {
          items = res.data.content || res.data.items || res.data || [];
        } else if (Array.isArray(res)) {
          items = res;
        } else if (res?.content || res?.items) {
          items = res.content || res.items || [];
        } else if (res?.data) {
          items = Array.isArray(res.data)
            ? res.data
            : res.data.content || res.data.items || [];
        }

        setAllConversations(items);

        let filteredItems = items;

        if (searchQuery && searchQuery.length >= 3) {
          const query = searchQuery.toLowerCase();
          filteredItems = filteredItems.filter((conv) => {
            const otherParticipant =
              getOtherParticipant(conv, currentUserId) || {};
            const name = (
              otherParticipant.name ||
              otherParticipant.fullName ||
              ""
            ).toLowerCase();
            const lastMessage = (
              conv?.lastMessage?.textContent || ""
            ).toLowerCase();
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
          setConversations(filteredItems);
        } else {
          if (
            res &&
            (res.success !== undefined ||
              Array.isArray(res) ||
              res.content !== undefined ||
              res.items !== undefined)
          ) {
            setConversations([]);
            setAllConversations([]);
          }
        }
      } catch (e) {
      } finally {
        setLoadingConversations(false);
      }
    },
    [user, currentUserId, searchQuery, filterUnread]
  );

  // Cập nhật ref với hàm loadConversations mới nhất
  useEffect(() => {
    loadConversationsRef.current = loadConversations;
  }, [loadConversations]);

  // Tải danh sách conversations lần đầu khi user đã sẵn sàng
  useEffect(() => {
    if (!hasLoadedOnce && user && currentUserId) {
      loadConversations();
      setHasLoadedOnce(true);
    }
  }, [user, currentUserId, hasLoadedOnce, loadConversations]);

  // Tải lại danh sách khi có refreshTrigger
  useEffect(() => {
    if (refreshTrigger !== null && refreshTrigger > 0 && user) {
      loadConversations();
    }
  }, [refreshTrigger, user, loadConversations]);

  // Filter conversations theo searchQuery và filterUnread
  useEffect(() => {
    if (allConversations.length > 0) {
      let filteredItems = [...allConversations];

      if (searchQuery && searchQuery.length >= 3) {
        const query = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter((conv) => {
          const otherParticipant =
            getOtherParticipant(conv, currentUserId) || {};
          const name = (
            otherParticipant.name ||
            otherParticipant.fullName ||
            ""
          ).toLowerCase();
          const lastMessage = (
            conv?.lastMessage?.textContent || ""
          ).toLowerCase();
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
  }, [searchQuery, filterUnread, allConversations, currentUserId]);

  // Tự động refresh danh sách conversations mỗi 30 giây
  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => {
      if (loadConversationsRef.current) {
        loadConversationsRef.current();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, currentUserId]);

  // Lắng nghe events để refresh danh sách khi có tin nhắn mới
  useEffect(() => {
    if (!user) return;

    let refreshTimeout = null;

    const handleMessageReceived = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (loadConversationsRef.current) {
          loadConversationsRef.current();
        }
      }, 500);
    };

    const handleMessageSent = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (loadConversationsRef.current) {
          loadConversationsRef.current();
        }
      }, 300);
    };

    window.addEventListener("chat-message-received", handleMessageReceived);
    window.addEventListener("chat-message-sent", handleMessageSent);
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener(
        "chat-message-received",
        handleMessageReceived
      );
      window.removeEventListener("chat-message-sent", handleMessageSent);
    };
  }, [user]);

  // Định dạng timestamp thành chuỗi thời gian dễ đọc (HH:mm, Hôm qua, thứ X, DD/MM/YYYY)
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

  // Lấy preview tin nhắn cuối cùng (text, ảnh, video hoặc "Chưa có tin nhắn")
  const getLastMessagePreview = (conversation) => {
    const lastMessage = conversation?.lastMessage;

    if (!lastMessage) {
      if (conversation?.lastMessageId) {
        return "Tin nhắn";
      }
      return "Chưa có tin nhắn";
    }

    const type = lastMessage?.type?.toUpperCase();
    if (type === "IMAGE") return "📷 Ảnh";
    if (type === "VIDEO") return "🎥 Video";
    
    const text = lastMessage?.textContent || lastMessage?.content || "";
    if (text) {
      return text.length > 50 ? text.substring(0, 50) + "..." : text;
    }
    
    return "Tin nhắn";
  };

  // Tạo URL đầy đủ cho avatar từ filename
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
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
          const otherParticipant =
            getOtherParticipant(conversation, currentUserId) || {};
          const recipientId = normalizeUserId(otherParticipant?.id);
          const recipientName =
            otherParticipant?.fullName ||
            otherParticipant?.name ||
            (recipientId ? `User ${recipientId}` : "Người dùng");
          const recipientAvatar =
            otherParticipant?.avatarUrl ||
            getAvatarUrl(otherParticipant?.avatarFilename);
          const isSelected = conversation?.id === selectedConversationId;
          const lastMessageTime =
            conversation?.lastMessage?.createdAt ||
            conversation?.lastMessageAt ||
            conversation?.updatedAt ||
            conversation?.createdAt;
          const itemKey = conversation?.id
            ? `conv-${conversation.id}`
            : `conv-fallback-${recipientId || "unknown"}-${index}`;

          return (
            <List.Item
              key={itemKey}
              className={`${s.conversationItem} ${
                isSelected ? s.selected : ""
              }`}
              onClick={() =>
                onSelectConversation?.(
                  conversation.id,
                  recipientId,
                  otherParticipant
                )
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={recipientAvatar}
                    icon={!recipientAvatar && <UserOutlined />}
                    size={40}
                    style={{ flexShrink: 0 }}
                  />
                }
                title={
                  <div className={s.conversationTitle}>
                    <span className={s.recipientName}>{recipientName}</span>
                    {lastMessageTime && (
                      <span className={s.time}>
                        {formatTime(lastMessageTime)}
                      </span>
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
