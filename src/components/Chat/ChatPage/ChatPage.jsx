import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Typography, Drawer, Button, Badge, App, Input, Layout } from "antd";
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
const { Sider, Content } = Layout;

const ChatPage = () => {
  const { conversationId: urlConversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { message: messageApi } = App.useApp();
  const [selectedConversationId, setSelectedConversationId] = useState(() => {
    const cid = urlConversationId ? parseInt(urlConversationId) : null;
    return cid;
  });
  const [recipientId, setRecipientId] = useState(location.state?.recipientId || null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [conversationListRefresh, setConversationListRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Tải thông tin người nhận từ danh sách conversations
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
  
  // Xử lý khi chọn một cuộc trò chuyện: load tin nhắn và cập nhật state
  const handleSelectConversation = useCallback(async (conversationId, otherUserId, recipientInfoFromList = null) => {
    if (selectedConversationId === conversationId && recipientId === otherUserId) {
      return;
    }
    
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
      await loadMessageHistory(conversationId);
    } catch (error) {
      messageApi.error("Không thể tải tin nhắn");
    }
    
    markConversationSeen(conversationId);
    setMobileDrawerVisible(false);
  }, [selectedConversationId, recipientId, loadMessageHistory, markConversationSeen, loadRecipientInfo, messageApi, setCurrentConversationId]);

  // Tự động chọn cuộc trò chuyện đầu tiên nếu chưa có conversation nào được chọn
  useEffect(() => {
    if (!selectedConversationId && !urlConversationId && !recipientId && chatConnected && currentUserId) {
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
              handleSelectConversation(convId, otherUserId, otherParticipant);
            }
          }
        } catch (e) {
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
        setRecipientId(normalizedStateId);
        loadRecipientInfo(normalizedStateId);
        openingConversationRef.current = false;
      }
    }
  }, [location.state?.recipientId, recipientId, loadRecipientInfo]);

  // Mở cuộc trò chuyện mới với recipientId nếu chưa có conversation
  useEffect(() => {
    if (openingConversationRef.current) {
      return;
    }
    
    if (selectedConversationId) {
      openingConversationRef.current = false;
      return;
    }
    
    if (chatConnected && recipientId && !selectedConversationId) {
      openingConversationRef.current = true;
      
      openConversationWithUser(recipientId).then(async (result) => {
        openingConversationRef.current = false;
        
        if (result) {
          const cid = typeof result === 'number' ? result : (result.id || result);
          
          setSelectedConversationId(cid);
          setCurrentConversationId(cid);
          
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
                setRecipientId(normalizedNewId);
              }
            } else if (!recipientId && result.userAId && result.userBId) {
              const resultUserA = normalizeUserId(result.userAId);
              const resultUserB = normalizeUserId(result.userBId);
              
              const fallbackRecipientId = resultUserA === currentUserId 
                ? resultUserB 
                : resultUserA;
              if (fallbackRecipientId) {
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
        messageApi.error("Không thể mở cuộc trò chuyện");
      });
    }
  }, [chatConnected, recipientId, selectedConversationId, currentUserId, messageApi, openConversationWithUser, loadRecipientInfo, loadMessageHistory, markConversationSeen, setCurrentConversationId]);

  // Tải thông tin recipient nếu chưa có
  useEffect(() => {
    if (recipientId && !recipientInfo) {
      loadRecipientInfo(recipientId);
    }
  }, [recipientId, recipientInfo, loadRecipientInfo]);

  // Đồng bộ selectedConversationId với URL
  useEffect(() => {
    const currentUrlId = urlConversationId ? parseInt(urlConversationId) : null;
    const selectedId = selectedConversationId ? parseInt(selectedConversationId) : null;
    
    if (selectedId && selectedId !== currentUrlId && selectedId !== latestSelectedConversationIdRef.current) {
      navigate(`/chat/${selectedId}`, { replace: true });
    } else if (!selectedId && currentUrlId) {
      if (latestSelectedConversationIdRef.current === null) {
        navigate("/chat", { replace: true });
      }
    }
  }, [selectedConversationId, navigate, urlConversationId]);

  // Load conversation từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    if (urlConversationId) {
      const cid = parseInt(urlConversationId);
      if (!isNaN(cid) && cid !== latestSelectedConversationIdRef.current) {
        setSelectedConversationId(cid);
        setCurrentConversationId(cid);
        
        loadMessageHistory(cid).catch((error) => {
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
          }
        };
        
        setTimeout(() => {
          loadRecipientFromConversation();
        }, 500);
      }
    }
  }, [urlConversationId, chatConnected, currentUserId, loadRecipientInfo, messageApi, setCurrentConversationId, loadMessageHistory, markConversationSeen]);

  // Lấy recipientId từ tin nhắn đầu tiên nếu chưa có
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

  // Gửi tin nhắn media (ảnh/video) với validation kích thước file
  const handleSendMedia = (file, type) => {
    if (!selectedConversationId) {
      messageApi.warning("Chưa chọn cuộc trò chuyện");
      return;
    }
    if (!recipientId) {
      messageApi.warning("Không tìm thấy người nhận");
      return;
    }
    
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };
    
    if (type === "IMAGE" && file.size > MAX_IMAGE_SIZE) {
      messageApi.error({
        content: `Kích thước ảnh không được vượt quá ${formatFileSize(MAX_IMAGE_SIZE)}. File của bạn: ${formatFileSize(file.size)}`,
        duration: 5,
      });
      return;
    }
    
    if (type === "VIDEO" && file.size > MAX_VIDEO_SIZE) {
      messageApi.error({
        content: `Dung lượng video không được vượt quá ${formatFileSize(MAX_VIDEO_SIZE)}. File của bạn: ${formatFileSize(file.size)}`,
        duration: 5,
      });
      return;
    }
    
    sendMedia(file, type, selectedConversationId, recipientId);
    setTimeout(() => {
      setConversationListRefresh((prev) => prev + 1);
    }, 500);
  };

  // Tạo URL đầy đủ cho avatar từ filename
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}/api/accounts/image/${filename}/avatar`;
  };

  const recipientName = recipientInfo?.name || recipientInfo?.fullName || "Người dùng";
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

  // Xử lý khi click vào quick reply button
  const handleQuickReply = (text) => {
    handleSendText(text);
  };

  // Render header của chat panel (tên người nhận hoặc placeholder)
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
      <Layout className={s.chatShell}>
        <Sider 
          width={420} 
          className={s.sidebar}
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
        >
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
          </div>
          <div className={s.sidebarBody}>
            <ConversationList
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              loading={chatLoading}
              refreshTrigger={conversationListRefresh}
              searchQuery={searchQuery}
            />
          </div>
        </Sider>

        <Layout className={s.mainLayout}>
          <Content className={s.mainPanel}>
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
                    conversationId={selectedConversationId}
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
          </Content>
        </Layout>
      </Layout>

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

