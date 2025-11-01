import React from "react";
import { Button, Typography } from "antd";
import "./RequireLoginLayout.scss";

const { Title, Text } = Typography;

const RequireLoginLayout = ({
  title = "Thông Báo",
  subtitle = "Hoạt Động",
  message = "Vui lòng đăng nhập để xem danh sách hoạt động",
  buttonText = "Đăng ký / Đăng nhập",
  onLoginClick,
}) => {
  return (
    <div className="require-login-layout">
      <div className="require-login-content">
        <div className="require-login-header">
          <Title level={4} className="require-login-title">
            {title}
          </Title>
          <div className="require-login-subtitle-container">
            <Text className="require-login-subtitle">{subtitle}</Text>
            <div className="require-login-underline" />
          </div>
        </div>

        <div className="require-login-body">
          <Text className="require-login-message">{message}</Text>

          <Button
            type="default"
            className="require-login-button"
            onClick={onLoginClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequireLoginLayout;
