import React, { useEffect, useState } from "react";
import { Button, Badge, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { getUnreadCount } from "@services/chatService";

const ChatButton = ({ iconSize = "18px", buttonSize = "40px" }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    let loadingRef = false;
    let timeoutRef = null;

    const loadUnreadCount = async () => {
      // Prevent concurrent calls
      if (loadingRef) return;
      loadingRef = true;
      
      try {
        const count = await getUnreadCount();
        setUnreadCount(count || 0);
      } catch (e) {
        console.error("Load unread count error:", e);
        setUnreadCount(0);
      } finally {
        loadingRef = false;
      }
    };

    loadUnreadCount();
    
    const interval = setInterval(loadUnreadCount, 30000);
    
    // Debounced event handlers to prevent spam
    const handleMessageReceived = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      timeoutRef = setTimeout(() => {
        loadUnreadCount();
      }, 1000);
    };
    
    const handleMessageSent = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      timeoutRef = setTimeout(() => {
        loadUnreadCount();
      }, 1000);
    };
    
    window.addEventListener('chat-message-received', handleMessageReceived);
    window.addEventListener('chat-message-sent', handleMessageSent);
    
    return () => {
      clearInterval(interval);
      if (timeoutRef) clearTimeout(timeoutRef);
      window.removeEventListener('chat-message-received', handleMessageReceived);
      window.removeEventListener('chat-message-sent', handleMessageSent);
    };
  }, [isLoggedIn]);

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <Tooltip title="Chat">
      <Badge count={unreadCount > 0 ? unreadCount : 0} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<MessageOutlined style={{ fontSize: iconSize }} />}
          onClick={handleClick}
          style={{
            borderRadius: "50%",
            width: buttonSize,
            height: buttonSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Badge>
    </Tooltip>
  );
};

export default ChatButton;

