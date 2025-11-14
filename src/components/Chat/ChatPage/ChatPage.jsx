import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Typography, Drawer, Button, Badge, App, Input, Tabs } from "antd";
import { UserOutlined, MenuOutlined, MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useChat } from "@hooks/useChat";
import { useAuth } from "@contexts/AuthContext";
import ConversationList from "../ConversationList";
import MessageList from "../MessageList";
import ChatInput from "../ChatInput";
import { getConversations } from "@services/chatService";
import { getAccountDbId, normalizeUserId, getOtherParticipant } from "@utils/chatUtils";
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
  const {
    connected: chatConnected,
    messages: chatMessages,
    loading: chatLoading,
    setCurrentConversationId,
    loadMessageHistory,
    markConversationSeen,
    openConversationWithUser,
    sendText,
    sendMedia,
    messagesEndRef,
  } = chat;

  const currentUserId = getAccountDbId(user);
  const latestSelectedConversationIdRef = React.useRef(selectedConversationId);

  useEffect(() => {
    latestSelectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

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
            const otherParticipant = getOtherParticipant(conv, currentUserId);
            const otherId = normalizeUserId(otherParticipant?.id);
            return otherId === normalizedUserId;
          }
        );
        if (conversation) {
          const otherParticipant = getOtherParticipant(conversation, currentUserId);
          if (otherParticipant && (otherParticipant.name || otherParticipant.fullName)) {
            setRecipientInfo(otherParticipant);
            return true;
          }
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
  
  const handleSelectConversation = useCallback(async (conversationId, otherUserId, recipientInfoFromList = null) => {
    // Prevent duplicate calls for the same conversation
    if (selectedConversationId === conversationId && recipientId === otherUserId) {
      console.log("[ChatPage] handleSelectConversation: skipping duplicate call for same conversation");
      return;
    }
    
    console.log("[ChatPage] handleSelectConversation called:", { conversationId, otherUserId });
    setSelectedConversationId(conversationId);
    setRecipientId(otherUserId);
    setCurrentConversationId(conversationId);
    
    // Use recipientInfo from list if available to avoid extra API call
    if (recipientInfoFromList) {
      setRecipientInfo(recipientInfoFromList);
    } else if (otherUserId) {
      // Only load if we don't have the info
      loadRecipientInfo(otherUserId);
    }
    
    try {
      console.log("[ChatPage] Loading message history for conversation:", conversationId);
      await loadMessageHistory(conversationId);
      console.log("[ChatPage] Messages loaded for conversation:", conversationId);
    } catch (error) {
      console.error("[ChatPage] Error loading messages:", error);
      messageApi.error("Không thể tải tin nhắn");
    }
    
    markConversationSeen(conversationId);
    setMobileDrawerVisible(false);
  }, [selectedConversationId, recipientId, loadMessageHistory, markConversationSeen, loadRecipientInfo, messageApi, setCurrentConversationId]);

  useEffect(() => {
    if (!selectedConversationId && !urlConversationId && !recipientId && chatConnected && currentUserId) {
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
            const otherParticipant = getOtherParticipant(firstConv, currentUserId);
            const otherUserId = normalizeUserId(otherParticipant?.id);
            
            if (convId && otherUserId) {
              console.log("[ChatPage] Auto-selecting conversation:", convId, "with user:", otherUserId);
              handleSelectConversation(convId, otherUserId, otherParticipant);
            }
          }
        } catch (e) {
          console.error("[ChatPage] Error loading conversations for auto-select:", e);
        }
      };
      
      const timeout = setTimeout(loadAndSelectFirst, 500);
      return () => clearTimeout(timeout);
    }
  }, [selectedConversationId, urlConversationId, recipientId, chatConnected, currentUserId, handleSelectConversation]);

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
    
    if (chatConnected && recipientId && !selectedConversationId) {
      console.log("Opening conversation - connected:", chatConnected, "recipientId:", recipientId);
      openingConversationRef.current = true;
      
      openConversationWithUser(recipientId).then(async (result) => {
        openingConversationRef.current = false;
        
        if (result) {
          const cid = typeof result === 'number' ? result : (result.id || result);
          console.log("Conversation opened successfully, id:", cid);
          
          setSelectedConversationId(cid);
          setCurrentConversationId(cid);
          
          console.log("Conversation setup complete, WebSocket will auto-subscribe");
          
          console.log("Loading message history for conversation:", cid);
          await loadMessageHistory(cid);
          
          markConversationSeen(cid);
          
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
  }, [chatConnected, recipientId, selectedConversationId, currentUserId, messageApi, openConversationWithUser, loadRecipientInfo, loadMessageHistory, markConversationSeen, setCurrentConversationId]);

  // Only load recipientInfo if we don't already have it
  useEffect(() => {
    if (recipientId && !recipientInfo) {
      loadRecipientInfo(recipientId);
    }
  }, [recipientId, recipientInfo, loadRecipientInfo]);

  // Sync selectedConversationId to URL (but avoid loops)
  useEffect(() => {
    const currentUrlId = urlConversationId ? parseInt(urlConversationId) : null;
    const selectedId = selectedConversationId ? parseInt(selectedConversationId) : null;
    
    // Only navigate if there's a real change and we're not already in the middle of loading from URL
    if (selectedId && selectedId !== currentUrlId && selectedId !== latestSelectedConversationIdRef.current) {
      console.log("[ChatPage] Syncing selectedConversationId to URL:", selectedId);
      navigate(`/chat/${selectedId}`, { replace: true });
    } else if (!selectedId && currentUrlId) {
      // Only clear URL if we explicitly cleared the selection (not during initial load)
      if (latestSelectedConversationIdRef.current === null) {
        console.log("[ChatPage] Clearing URL - no conversation selected");
        navigate("/chat", { replace: true });
      }
    }
  }, [selectedConversationId, navigate, urlConversationId]);

  useEffect(() => {
    if (urlConversationId) {
      const cid = parseInt(urlConversationId);
      if (!isNaN(cid) && cid !== latestSelectedConversationIdRef.current) {
        console.log("[ChatPage] Loading conversation from URL:", cid, "WebSocket connected:", chatConnected);
        setSelectedConversationId(cid);
        setCurrentConversationId(cid);
        
        loadMessageHistory(cid).then(() => {
          console.log("[ChatPage] Messages loaded for conversation:", cid);
        }).catch((error) => {
          console.error("[ChatPage] Error loading messages:", error);
          messageApi.error("Không thể tải tin nhắn");
        });
        
        markConversationSeen(cid);
        
        const loadRecipientFromConversation = async () => {
          try {
            const res = await getConversations(0, 100);
            if (res?.success && res?.data) {
              const conversations = res.data.content || res.data.items || [];
              const conversation = conversations.find((conv) => conv.id === cid);
              if (conversation) {
                const otherParticipant = getOtherParticipant(conversation, currentUserId);
                if (otherParticipant) {
                  setRecipientInfo(otherParticipant);
                  const otherId = normalizeUserId(otherParticipant.id);
                  if (otherId) {
                    setRecipientId(otherId);
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
  }, [urlConversationId, chatConnected, currentUserId, loadRecipientInfo, messageApi, setCurrentConversationId, loadMessageHistory, markConversationSeen]);

  useEffect(() => {
    if (selectedConversationId && !recipientId && chatMessages.length > 0) {
      const firstMessage = chatMessages[0];
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
  }, [chatMessages, selectedConversationId, recipientId, currentUserId, loadRecipientInfo]);

  const handleSendText = (text) => {
    if (!selectedConversationId) {
      messageApi.warning("Chưa chọn cuộc trò chuyện");
      return;
    }
    if (!recipientId) {
      messageApi.warning("Không tìm thấy người nhận");
      return;
    }
    sendText(text, selectedConversationId, recipientId);
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
    sendMedia(file, type, selectedConversationId, recipientId);
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
  // Prioritize avatarUrl directly from API, fallback to getAvatarUrl(avatarFilename)
  const recipientAvatar = recipientInfo?.avatarUrl || getAvatarUrl(recipientInfo?.avatarFilename);

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
        </div>
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
              loading={chatLoading}
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
            {selectedConversationId && !chatConnected && (
              <Badge status="error" text="Đang kết nối..." className={s.connectionBadge} />
            )}
          </div>

          {selectedConversationId ? (
            <>
              <div className={s.mainBody}>
                <MessageList
                  messages={chatMessages}
                  loading={chatLoading}
                  messagesEndRef={messagesEndRef}
                  recipientInfo={recipientInfo}
                  currentUserId={currentUserId}
                />
              </div>
              {chatMessages.length === 0 && (
                <div className={s.quickReplies}>
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={`quick-reply-${index}-${reply.substring(0, 10)}`}
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
                  disabled={!chatConnected || !selectedConversationId}
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
          loading={chatLoading}
          refreshTrigger={conversationListRefresh}
          currentUserId={currentUserId}
        />
      </Drawer>
    </div>
  );
};

export default ChatPage;

