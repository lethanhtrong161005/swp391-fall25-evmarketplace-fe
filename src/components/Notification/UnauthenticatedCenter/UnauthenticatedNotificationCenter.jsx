import React, { useState } from "react";
import { Badge, Popover, Button, Tooltip } from "antd";
import { BellOutlined } from "@ant-design/icons";
import RequireLoginLayout from "../RequireLogin/RequireLoginLayout";

const UnauthenticatedNotificationCenter = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notificationContent = (
    <RequireLoginLayout
      title="Thông Báo"
      subtitle="Hoạt Động"
      message="Vui lòng đăng nhập để xem danh sách hoạt động"
      buttonText="Đăng ký / Đăng nhập"
      onLoginClick={() => {
        setIsOpen(false);
        onLoginClick();
      }}
    />
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      arrow={false}
      overlayClassName="notification-popover"
    >
      <Tooltip title="Thông báo" placement="bottom">
        <div className="notification-bell-container">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: "18px" }} />}
            className="notification-bell-button unauthenticated-notification-button"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </Tooltip>
    </Popover>
  );
};

export default UnauthenticatedNotificationCenter;
