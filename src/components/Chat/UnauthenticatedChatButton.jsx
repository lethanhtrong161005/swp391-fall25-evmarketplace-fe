import React, { useState } from "react";
import { Popover, Button, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import RequireLoginLayout from "../Notification/RequireLogin/RequireLoginLayout";

const UnauthenticatedChatButton = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const chatContent = (
    <RequireLoginLayout
      title="Chat"
      subtitle="Tin Nhắn"
      message="Vui lòng đăng nhập để sử dụng tính năng chat"
      buttonText="Đăng ký / Đăng nhập"
      onLoginClick={() => {
        setIsOpen(false);
        onLoginClick();
      }}
    />
  );

  return (
    <Popover
      content={chatContent}
      title={null}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      arrow={false}
      overlayClassName="chat-popover"
    >
      <Tooltip title="Chat" placement="bottom">
        <Button
          type="text"
          icon={<MessageOutlined style={{ fontSize: "18px" }} />}
          className="unauthenticated-chat-button"
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Tooltip>
    </Popover>
  );
};

export default UnauthenticatedChatButton;
