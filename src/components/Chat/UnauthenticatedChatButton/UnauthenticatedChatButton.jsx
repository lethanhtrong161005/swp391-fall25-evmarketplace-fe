import React from "react";
import { Button, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const UnauthenticatedChatButton = ({ 
  onLoginClick, 
  variant = "header", // "header" or "detail"
  iconSize = "18px",
  buttonSize = "40px"
}) => {
  const handleClick = () => {
    onLoginClick?.();
  };

  // Variant cho Header - icon button tròn
  if (variant === "header") {
    return (
      <Tooltip title="Chat" placement="bottom">
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
      </Tooltip>
    );
  }

  // Variant cho ProductDetail - nút có text
  return (
    <Button
      className="product-info__contact-btn product-info__contact-btn--chat"
      icon={<MessageOutlined />}
      onClick={handleClick}
    >
      Chat
    </Button>
  );
};

export default UnauthenticatedChatButton;

