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
  conversationId = null, // Track conversation ID to detect conversation changes
}) => {
  const listRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const isInitialLoadRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);
  const previousConversationIdRef = useRef(null);

  // Check if user is near bottom (within 100px)
  const isNearBottom = () => {
    if (!listRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Update shouldScrollRef when user scrolls
  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  // Scroll to bottom helper - uses scrollTop instead of scrollIntoView to avoid page scroll
  const scrollToBottom = (smooth = false) => {
    if (!listRef.current) return;
    const container = listRef.current;
    if (smooth) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    // Skip if no messages
    if (messages.length === 0) {
      return;
    }

    const currentMessagesLength = messages.length;
    const previousLength = previousMessagesLengthRef.current;
    const isNewMessage = currentMessagesLength > previousLength;
    const isMessageRemoved = currentMessagesLength < previousLength;
    const isNewConversation = conversationId !== null && conversationId !== previousConversationIdRef.current;

    // On initial load, scroll to bottom to show latest messages
    if (isInitialLoadRef.current && !loading) {
      isInitialLoadRef.current = false;
      // Scroll to bottom on initial load to show latest messages
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
      previousMessagesLengthRef.current = currentMessagesLength;
      previousConversationIdRef.current = conversationId;
      return;
    }

    // If conversation changed (not initial load), scroll to bottom
    if (isNewConversation && previousConversationIdRef.current !== null) {
      // Conversation changed - scroll to bottom to show latest messages
      previousConversationIdRef.current = conversationId;
      isInitialLoadRef.current = true; // Reset for new conversation
      setTimeout(() => {
        scrollToBottom(false);
      }, 150);
      previousMessagesLengthRef.current = currentMessagesLength;
      return;
    }

    // Update conversation ID ref
    if (conversationId !== previousConversationIdRef.current) {
      previousConversationIdRef.current = conversationId;
    }

    // If messages were removed (e.g., conversation changed), scroll to bottom
    if (isMessageRemoved) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 100);
      previousMessagesLengthRef.current = currentMessagesLength;
      return;
    }

    // For new messages, only scroll if user is near bottom
    // Also check if the new message is from current user (they just sent it)
    if (isNewMessage) {
      const lastMessage = messages[messages.length - 1];
      const isOwnMessage = lastMessage && isMessageFromCurrentUser(lastMessage, currentUserId);
      
      // Always scroll if it's user's own message (they just sent it)
      // Or scroll if user is near bottom
      if (isOwnMessage || (shouldScrollRef.current && isNearBottom())) {
        setTimeout(() => {
          scrollToBottom(true);
        }, 50);
      }
    }

    previousMessagesLengthRef.current = currentMessagesLength;
  }, [messages, loading, currentUserId]);

  // Reset initial load flag when messages are cleared or conversation changes
  useEffect(() => {
    if (messages.length === 0) {
      isInitialLoadRef.current = true;
      previousMessagesLengthRef.current = 0;
    }
  }, [messages.length, conversationId]);

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
        {/* Spacer to push messages to bottom when there are few messages */}
        <div className={s.spacer} />
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

