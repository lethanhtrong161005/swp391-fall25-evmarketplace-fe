import React, { useEffect, useState } from "react";
import { Button, Badge, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { getConversations } from "@services/chatService";

const ChatButton = ({ iconSize = "18px", buttonSize = "40px" }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const res = await getConversations(0, 100);
        if (res?.success && res?.data) {
          const conversations = res.data.content || res.data.items || [];
          const totalUnread = conversations.reduce((sum, conv) => {
            return sum + (conv.unreadCount || 0);
          }, 0);
          setUnreadCount(totalUnread);
        }
      } catch (e) {
        console.error("Load unread count error:", e);
      }
    };

    loadUnreadCount();
    
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
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

