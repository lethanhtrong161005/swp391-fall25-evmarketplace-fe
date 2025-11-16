import React, { useEffect, useRef } from "react";
import { Spin, Empty } from "antd";
import MessageItem from "../MessageItem";
import { isMessageFromCurrentUser, normalizeUserId } from "@utils/chatUtils";
import s from "./MessageList.module.scss";

const MessageList = ({
  messages = [],
  loading = false,
  messagesEndRef,
  recipientInfo = null,
  currentUserId = null,
}) => {
  const listRef = useRef(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (shouldScrollRef.current && messagesEndRef?.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, messagesEndRef]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  if (loading && messages.length === 0) {
    return (
      <div className={s.messageList}>
        <div className={s.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!loading && messages.length === 0) {
    return (
      <div className={s.messageList}>
        <Empty
          description="Chưa có tin nhắn nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div
      className={s.messageList}
      ref={listRef}
      onScroll={handleScroll}
    >
      <div className={s.messagesContainer}>
        {messages.map((message, index) => {
          const isOwnMessage = isMessageFromCurrentUser(message, currentUserId);
          // Use conversationId + message.id for unique key, fallback to index if needed
          const uniqueKey = message?.conversationId && message?.id 
            ? `conv-${message.conversationId}-msg-${message.id}` 
            : message?.id 
            ? `msg-${message.id}-${index}` 
            : `msg-index-${index}`;
          
          return (
            <MessageItem
              key={uniqueKey}
              message={message}
              isOwnMessage={isOwnMessage}
              senderInfo={isOwnMessage ? { id: currentUserId } : recipientInfo}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {loading && messages.length > 0 && (
        <div className={s.loadingMore}>
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};

export default MessageList;

