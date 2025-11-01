import React, { useState } from "react";
import { Popover, Button, Tooltip } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import RequireLoginLayout from "../Notification/RequireLogin/RequireLoginLayout";

const UnauthenticatedFavoritesDropdown = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const favoritesContent = (
    <RequireLoginLayout
      title="Tin Đăng Đã Lưu"
      subtitle="Yêu Thích"
      message="Vui lòng đăng nhập để xem danh sách tin đăng đã lưu"
      buttonText="Đăng ký / Đăng nhập"
      onLoginClick={() => {
        setIsOpen(false);
        onLoginClick();
      }}
    />
  );

  return (
    <Popover
      content={favoritesContent}
      title={null}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      arrow={false}
      overlayClassName="favorites-dropdown-overlay"
    >
      <Tooltip title="Tin đăng đã lưu" placement="bottom">
        <Button
          type="text"
          icon={<HeartOutlined style={{ fontSize: "18px" }} />}
          className="favorites-dropdown__trigger unauthenticated-favorites-button"
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

export default UnauthenticatedFavoritesDropdown;
