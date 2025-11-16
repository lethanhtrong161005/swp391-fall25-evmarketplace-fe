import React, { useState, useEffect } from "react";
import { Drawer, Button, Badge, Avatar, Typography } from "antd";
import { MessageOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { useChat } from "@hooks/useChat";
import { useAuth } from "@contexts/AuthContext";
import ConversationList from "../ConversationList";
import MessageList from "../MessageList";
import ChatInput from "../ChatInput";
import { getAccountById } from "@services/accountService";
import s from "./ChatWidget.module.scss";

const { Text } = Typography;

const ChatWidget = ({ initialRecipientId = null }) => {
  const { user } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [recipientId, setRecipientId] = useState(initialRecipientId);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);

  const chat = useChat(selectedConversationId, recipientId);

  useEffect(() => {
    if (initialRecipientId && !selectedConversationId) {
      chat.openConversationWithUser(initialRecipientId).then((cid) => {
        if (cid) {
          setSelectedConversationId(cid);
          setRecipientId(initialRecipientId);
          setShowConversationList(false);
          loadRecipientInfo(initialRecipientId);
        }
      });
    }
  }, [initialRecipientId]);

  useEffect(() => {
    if (selectedConversationId && recipientId) {
      loadRecipientInfo(recipientId);
    }
  }, [selectedConversationId, recipientId]);

  const loadRecipientInfo = async (userId) => {
    try {
      const res = await getAccountById(userId);
      if (res?.success && res?.data) {
        setRecipientInfo(res.data);
      }
    } catch (e) {
      console.error("Load recipient info error:", e);
    }
  };

  const handleSelectConversation = (conversationId, otherUserId) => {
    setSelectedConversationId(conversationId);
    setRecipientId(otherUserId);
    chat.setCurrentConversationId(conversationId);
    chat.loadMessageHistory(conversationId);
    chat.markConversationSeen(conversationId);
    setShowConversationList(false);
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setSelectedConversationId(null);
    setRecipientId(null);
    setRecipientInfo(null);
  };

  const handleSendText = (text) => {
    chat.sendText(text, selectedConversationId, recipientId);
  };

  const handleSendMedia = (file, type) => {
    chat.sendMedia(file, type, selectedConversationId, recipientId);
  };

  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}/api/accounts/image/${filename}/avatar`;
  };

  const recipientName = recipientInfo?.name || recipientInfo?.fullName || "Người dùng";
  const recipientAvatar = getAvatarUrl(recipientInfo?.avatarFilename);

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        className={s.floatingButton}
        onClick={() => setDrawerVisible(true)}
      />

      <Drawer
        title={
          showConversationList ? (
            "Tin nhắn"
          ) : (
            <div className={s.drawerHeader}>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleBackToList}
                className={s.backButton}
              />
              <Avatar
                src={recipientAvatar}
                icon={!recipientAvatar && <UserOutlined />}
                size="small"
              />
              <Text strong className={s.recipientName}>
                {recipientName}
              </Text>
            </div>
          )
        }
        placement="right"
        onClose={() => {
          setDrawerVisible(false);
          setShowConversationList(true);
        }}
        open={drawerVisible}
        width={400}
        className={s.chatDrawer}
        styles={{
          body: { padding: 0, display: "flex", flexDirection: "column", height: "100%" }
        }}
      >
        {showConversationList ? (
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            loading={chat.loading}
          />
        ) : (
          <div className={s.chatContainer}>
            <MessageList
              messages={chat.messages}
              loading={chat.loading}
              messagesEndRef={chat.messagesEndRef}
              recipientInfo={recipientInfo}
            />
            <ChatInput
              onSendText={handleSendText}
              onSendMedia={handleSendMedia}
              disabled={!chat.connected || !selectedConversationId}
            />
          </div>
        )}
      </Drawer>
    </>
  );
};

export default ChatWidget;

