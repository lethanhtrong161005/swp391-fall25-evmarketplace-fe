import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Typography, Drawer, Button, Badge, App, Input, Tabs } from "antd";
import { UserOutlined, MenuOutlined, MessageOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useChat } from "@hooks/useChat";
import { useAuth } from "@contexts/AuthContext";
import ConversationList from "../ConversationList";
import MessageList from "../MessageList";
import ChatInput from "../ChatInput";
import { getConversations } from "@services/chatService";
import { getAccountDbId, normalizeUserId } from "@utils/chatUtils";
import s from "./ChatPage.module.scss";

const { Text } = Typography;

const ChatPage = () => {
  const { conversationId: urlConversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { message: messageApi } = App.useApp();
  const [selectedConversationId, setSelectedConversationId] = useState(() => {
    const cid = urlConversationId ? parseInt(urlConversationId) : null;
    if (cid && !isNaN(cid)) {
      console.log("[ChatPage] Initializing selectedConversationId from URL:", cid);
    }
    return cid;
  });
  const [recipientId, setRecipientId] = useState(location.state?.recipientId || null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [conversationListRefresh, setConversationListRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const openingConversationRef = React.useRef(false);

  const chat = useChat(selectedConversationId, recipientId);
  
  const currentUserId = getAccountDbId(user);
  
  const loadRecipientInfo = useCallback(async (userId) => {
    if (!userId) return false;
    
    const normalizedUserId = normalizeUserId(userId);
    if (!normalizedUserId) {
      return false;
    }
    
    try {
      const res = await getConversations(0, 100);
      if (res?.success && res?.data) {
        const conversations = res.data.content || res.data.items || [];
        const conversation = conversations.find(
          (conv) => {
            const otherId = normalizeUserId(conv.otherParticipant?.id);
            if (otherId === normalizedUserId) {
              return true;
            }
            if (currentUserId != null && (conv.userAId || conv.userBId)) {
              const convUserA = normalizeUserId(conv.userAId);
              const convUserB = normalizeUserId(conv.userBId);
              if (convUserA === currentUserId && convUserB === normalizedUserId) {
                return true;
              }
              if (convUserB === currentUserId && convUserA === normalizedUserId) {
                return true;
              }
            }
            return false;
          }
        );
        if (conversation?.otherParticipant?.name || conversation?.otherParticipant?.fullName) {
          setRecipientInfo(conversation.otherParticipant);
          return true;
        }
      }
    } catch (e) {
      // Ignore errors
    }
    
    const recipientInfo = {
      id: normalizedUserId,
      name: `User ${normalizedUserId}`,
      fullName: `User ${normalizedUserId}`,
    };
    setRecipientInfo(recipientInfo);
    return false;
  }, [currentUserId]);
  
  const handleSelectConversation = useCallback(async (conversationId, otherUserId) => {
    console.log("[ChatPage] handleSelectConversation called:", { conversationId, otherUserId });
    setSelectedConversationId(conversationId);
    setRecipientId(otherUserId);
    chat.setCurrentConversationId(conversationId);
    
    try {
      console.log("[ChatPage] Loading message history for conversation:", conversationId);
      await chat.loadMessageHistory(conversationId);
      console.log("[ChatPage] Messages loaded for conversation:", conversationId, "message count:", chat.messages.length);
    } catch (error) {
      console.error("[ChatPage] Error loading messages:", error);
      messageApi.error("Không thể tải tin nhắn");
    }
    
    chat.markConversationSeen(conversationId);
    setMobileDrawerVisible(false);
    
    if (otherUserId) {
      try {
        const res = await getConversations(0, 100);
        if (res?.success && res?.data) {
          const conversations = res.data.content || res.data.items || [];
          const conversation = conversations.find((conv) => conv.id === conversationId);
          if (conversation?.otherParticipant) {
            setRecipientInfo(conversation.otherParticipant);
          } else {
            loadRecipientInfo(otherUserId);
          }
        }
      } catch (e) {
        console.error("Load conversation error:", e);
        loadRecipientInfo(otherUserId);
      }
    }
  }, [chat, loadRecipientInfo, messageApi]);

  useEffect(() => {
    if (!selectedConversationId && !urlConversationId && !recipientId && chat.connected && currentUserId) {
      console.log("[ChatPage] Auto-selecting first conversation...");
      
      const loadAndSelectFirst = async () => {
        try {
          const res = await getConversations(0, 10);
          let conversations = [];
          
          if (res?.success && res?.data) {
            conversations = res.data.content || res.data.items || res.data || [];
          } else if (Array.isArray(res)) {
            conversations = res;
          } else if (res?.content || res?.items) {
            conversations = res.content || res.items || [];
          }
          
          if (conversations.length > 0) {
            const firstConv = conversations[0];
            const convId = firstConv.id;
            
            let otherUserId = null;
            if (firstConv.otherParticipant) {
              otherUserId = normalizeUserId(firstConv.otherParticipant.id);
            } else if (firstConv.userAId && firstConv.userBId) {
              const convUserA = normalizeUserId(firstConv.userAId);
              const convUserB = normalizeUserId(firstConv.userBId);
              otherUserId = convUserA === currentUserId ? convUserB : convUserA;
            }
            
            if (convId && otherUserId) {
              console.log("[ChatPage] Auto-selecting conversation:", convId, "with user:", otherUserId);
              handleSelectConversation(convId, otherUserId);
            }
          }
        } catch (e) {
          console.error("[ChatPage] Error loading conversations for auto-select:", e);
        }
      };
      
      const timeout = setTimeout(loadAndSelectFirst, 500);
      return () => clearTimeout(timeout);
    }
  }, [selectedConversationId, urlConversationId, recipientId, chat.connected, currentUserId, handleSelectConversation]);

  useEffect(() => {
    const recipientIdFromState = location.state?.recipientId;
    if (recipientIdFromState) {
      const normalizedStateId = normalizeUserId(recipientIdFromState);
      const normalizedCurrentId = normalizeUserId(recipientId);
      
      if (normalizedStateId && normalizedStateId !== normalizedCurrentId) {
        console.log("Setting recipientId from location state:", normalizedStateId);
        setRecipientId(normalizedStateId);
        loadRecipientInfo(normalizedStateId);
        openingConversationRef.current = false;
      }
    }
  }, [location.state?.recipientId, recipientId, loadRecipientInfo]);

  useEffect(() => {
    if (openingConversationRef.current) {
      console.log("Skipping duplicate openConversation call");
      return;
    }
    
    if (selectedConversationId) {
      openingConversationRef.current = false;
      return;
    }
    
    if (chat.connected && recipientId && !selectedConversationId) {
      console.log("Opening conversation - connected:", chat.connected, "recipientId:", recipientId);
      openingConversationRef.current = true;
      
      chat.openConversationWithUser(recipientId).then(async (result) => {
        openingConversationRef.current = false;
        
        if (result) {
          const cid = typeof result === 'number' ? result : (result.id || result);
          console.log("Conversation opened successfully, id:", cid);
          
          setSelectedConversationId(cid);
          chat.setCurrentConversationId(cid);
          
          console.log("Conversation setup complete, WebSocket will auto-subscribe");
          
          console.log("Loading message history for conversation:", cid);
          await chat.loadMessageHistory(cid);
          
          chat.markConversationSeen(cid);
          
          let foundRecipientInfo = false;
          if (typeof result === 'object' && result !== null) {
            let recipientIdFromConversation = null;
            if (result.userAId && result.userBId) {
              const resultUserA = normalizeUserId(result.userAId);
              const resultUserB = normalizeUserId(result.userBId);
              
              if (resultUserA === currentUserId) {
                recipientIdFromConversation = resultUserB;
              } else if (resultUserB === currentUserId) {
                recipientIdFromConversation = resultUserA;
              }
            }
            
            if (result.otherParticipant) {
              setRecipientInfo(result.otherParticipant);
              foundRecipientInfo = true;
            } else if (result.participants && Array.isArray(result.participants)) {
              const otherParticipant = result.participants.find(
                (p) => {
                  const pId = normalizeUserId(p.id || p.userId);
                  return pId !== null && pId !== currentUserId;
                }
              );
              if (otherParticipant) {
                setRecipientInfo(otherParticipant);
                foundRecipientInfo = true;
              }
            }
            
            if (recipientIdFromConversation) {
              const normalizedNewId = normalizeUserId(recipientIdFromConversation);
              const normalizedCurrentId = normalizeUserId(recipientId);
              
              if (normalizedNewId && normalizedNewId !== normalizedCurrentId) {
                console.log("Setting recipientId from conversation:", normalizedNewId);
                setRecipientId(normalizedNewId);
              }
            } else if (!recipientId && result.userAId && result.userBId) {
              const resultUserA = normalizeUserId(result.userAId);
              const resultUserB = normalizeUserId(result.userBId);
              
              const fallbackRecipientId = resultUserA === currentUserId 
                ? resultUserB 
                : resultUserA;
              if (fallbackRecipientId) {
                console.log("Setting recipientId from conversation (fallback):", fallbackRecipientId);
                setRecipientId(fallbackRecipientId);
              }
            }
          }
          
          setConversationListRefresh((prev) => prev + 1);
          
          if (!foundRecipientInfo) {
            setTimeout(async () => {
              const finalRecipientId = recipientId || result?.userAId || result?.userBId;
              if (finalRecipientId) {
                const loaded = await loadRecipientInfo(finalRecipientId);
                
                if (!loaded) {
                  const tempRecipientInfo = {
                    id: finalRecipientId,
                    name: `User ${finalRecipientId}`,
                    fullName: `User ${finalRecipientId}`,
                  };
                  setRecipientInfo(tempRecipientInfo);
                }
              }
            }, 800);
          }
        } else {
          messageApi.error("Không thể mở cuộc trò chuyện");
        }
      }).catch((error) => {
        openingConversationRef.current = false;
        console.error("Error opening conversation:", error);
        messageApi.error("Không thể mở cuộc trò chuyện");
      });
    }
  }, [chat.connected, recipientId, selectedConversationId, currentUserId, messageApi, chat, loadRecipientInfo]);

  useEffect(() => {
    if (recipientId) {
      loadRecipientInfo(recipientId);
    }
  }, [recipientId, loadRecipientInfo]);

  useEffect(() => {
    if (selectedConversationId && selectedConversationId.toString() !== urlConversationId) {
      navigate(`/chat/${selectedConversationId}`, { replace: true });
    } else if (!selectedConversationId && urlConversationId) {
      navigate("/chat", { replace: true });
    }
  }, [selectedConversationId, navigate, urlConversationId]);

  useEffect(() => {
    if (urlConversationId) {
      const cid = parseInt(urlConversationId);
      if (!isNaN(cid) && cid !== selectedConversationId) {
        console.log("[ChatPage] Loading conversation from URL:", cid, "WebSocket connected:", chat.connected);
        setSelectedConversationId(cid);
        chat.setCurrentConversationId(cid);
        
        chat.loadMessageHistory(cid).then(() => {
          console.log("[ChatPage] Messages loaded for conversation:", cid, "message count:", chat.messages.length);
        }).catch((error) => {
          console.error("[ChatPage] Error loading messages:", error);
          messageApi.error("Không thể tải tin nhắn");
        });
        
        chat.markConversationSeen(cid);
        
        const loadRecipientFromConversation = async () => {
          try {
            const res = await getConversations(0, 100);
            if (res?.success && res?.data) {
              const conversations = res.data.content || res.data.items || [];
              const conversation = conversations.find((conv) => conv.id === cid);
              if (conversation) {
                if (conversation.otherParticipant) {
                  setRecipientInfo(conversation.otherParticipant);
                  const otherId = normalizeUserId(conversation.otherParticipant.id);
                  if (otherId) {
                    setRecipientId(otherId);
                  }
                } else if (conversation.userAId && conversation.userBId) {
                  const convUserA = normalizeUserId(conversation.userAId);
                  const convUserB = normalizeUserId(conversation.userBId);
                  const otherId = convUserA === currentUserId ? convUserB : convUserA;
                  if (otherId) {
                    setRecipientId(otherId);
                    loadRecipientInfo(otherId);
                  }
                }
              }
            }
          } catch (e) {
            console.error("[ChatPage] Error loading conversation info:", e);
          }
        };
        
        setTimeout(() => {
          loadRecipientFromConversation();
        }, 500);
      }
    }
  }, [urlConversationId, selectedConversationId, chat, currentUserId, loadRecipientInfo]);

  useEffect(() => {
    if (selectedConversationId && !recipientId && chat.messages.length > 0) {
      const firstMessage = chat.messages[0];
      const msgRecipientId = normalizeUserId(firstMessage?.recipientId || firstMessage?.recipient?.id);
      const msgSenderId = normalizeUserId(firstMessage?.senderId || firstMessage?.sender?.id);
      
      const otherId = msgRecipientId === currentUserId ? msgSenderId : msgRecipientId;
      if (otherId && otherId !== currentUserId) {
        setRecipientId(otherId);
        const senderInfo = firstMessage?.sender || {};
        const recipientInfo = firstMessage?.recipient || {};
        const otherInfo = msgRecipientId === currentUserId ? senderInfo : recipientInfo;
        if (otherInfo && (otherInfo.id || otherInfo.name || otherInfo.fullName)) {
          setRecipientInfo(otherInfo);
        } else {
          loadRecipientInfo(otherId);
        }
      }
    }
  }, [chat.messages, selectedConversationId, recipientId, currentUserId, loadRecipientInfo]);

  const handleSendText = (text) => {
    if (!selectedConversationId) {
      messageApi.warning("Chưa chọn cuộc trò chuyện");
      return;
    }
    if (!recipientId) {
      messageApi.warning("Không tìm thấy người nhận");
      return;
    }
    chat.sendText(text, selectedConversationId, recipientId);
  };

  const handleSendMedia = (file, type) => {
    if (!selectedConversationId) {
      messageApi.warning("Chưa chọn cuộc trò chuyện");
      return;
    }
    if (!recipientId) {
      messageApi.warning("Không tìm thấy người nhận");
      return;
    }
    chat.sendMedia(file, type, selectedConversationId, recipientId);
    setTimeout(() => {
      setConversationListRefresh((prev) => prev + 1);
    }, 500);
  };

  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}/api/accounts/image/${filename}/avatar`;
  };

  const recipientName = recipientInfo?.name || recipientInfo?.fullName || "Người dùng";
  const recipientAvatar = getAvatarUrl(recipientInfo?.avatarFilename);

  const quickReplies = [
    "Xe này còn không ạ?",
    "Xe chính chủ hay được uỷ quyền ạ?",
    "Giá xe có thể thương lượng được không ạ?",
    "Xe có còn bảo hiểm không?",
    "Xe đã qua bao nhiêu đời chủ?",
    "Tình trạng sửa chữa như thế nào?",
    "Xe đã đi được bao nhiêu KM rồi ạ?",
    "Có hỗ trợ vay ngân hàng không bạn?",
  ];

  const handleQuickReply = (text) => {
    handleSendText(text);
  };

  const renderHeaderContent = () => {
    if (!selectedConversationId) {
      return (
        <div className={s.headerPlaceholder}>
          <Text className={s.headerTitle}>Chat</Text>
        </div>
      );
    }

    return (
      <div className={s.headerMain}>
        <Avatar
          src={recipientAvatar}
          icon={!recipientAvatar && <UserOutlined />}
          size="default"
        />
        <div className={s.recipientMeta}>
          <Text className={s.headerTitle}>{recipientName}</Text>
          <Text type="secondary" className={s.headerSubtitle}>
            • Hoạt động 2 giờ trước
          </Text>
        </div>
        <Button
          type="text"
          icon={<MoreOutlined />}
          className={s.headerMenuButton}
        />
      </div>
    );
  };

  return (
    <div className={s.pageWrapper}>
      <div className={s.chatShell}>
        <aside className={s.sidebar}>
          <div className={s.sidebarHeader}>
            <Text strong className={s.sidebarTitle}>
              Chat
            </Text>
            <div className={s.searchContainer}>
              <Input
                placeholder="Nhập 3 ký tự để bắt đầu tìm kiếm"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={s.searchInput}
              />
              <Button
                type="text"
                icon={<MoreOutlined />}
                className={s.searchMenuButton}
              />
            </div>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: "all", label: "Tất cả tin nhắn" },
                { key: "unread", label: "Tin chưa đọc" },
              ]}
              className={s.sidebarTabs}
            />
          </div>
          <div className={s.sidebarBody}>
            <ConversationList
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              loading={chat.loading}
              refreshTrigger={conversationListRefresh}
              searchQuery={searchQuery}
              filterUnread={activeTab === "unread"}
            />
          </div>
        </aside>

        <section className={s.mainPanel}>
          <div className={s.mainHeader}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              className={s.mobileMenuButton}
              onClick={() => setMobileDrawerVisible(true)}
            />
            {renderHeaderContent()}
            {selectedConversationId && !chat.connected && (
              <Badge status="error" text="Đang kết nối..." className={s.connectionBadge} />
            )}
          </div>

          {selectedConversationId ? (
            <>
              <div className={s.mainBody}>
                <MessageList
                  messages={chat.messages}
                  loading={chat.loading}
                  messagesEndRef={chat.messagesEndRef}
                  recipientInfo={recipientInfo}
                  currentUserId={currentUserId}
                />
              </div>
              {chat.messages.length === 0 && (
                <div className={s.quickReplies}>
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      size="small"
                      className={s.quickReplyButton}
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
              <div className={s.mainComposer}>
                <ChatInput
                  onSendText={handleSendText}
                  onSendMedia={handleSendMedia}
                  disabled={!chat.connected || !selectedConversationId}
                />
              </div>
            </>
          ) : (
            <div className={s.emptyState}>
              <div className={s.emptyCard}>
                <MessageOutlined style={{ fontSize: 56, color: "#d9d9d9" }} />
                <Text type="secondary" className={s.emptyTitle}>
                  Chọn một cuộc trò chuyện để xem tin nhắn
                </Text>
              </div>
            </div>
          )}
        </section>
      </div>

      <Drawer
        title="Tin nhắn"
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        width={320}
        styles={{ body: { padding: 0 } }}
      >
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          loading={chat.loading}
          refreshTrigger={conversationListRefresh}
          currentUserId={currentUserId}
        />
      </Drawer>
    </div>
  );
};

export default ChatPage;

