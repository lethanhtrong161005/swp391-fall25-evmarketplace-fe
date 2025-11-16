import React from "react";
import { Button, Avatar, Space, Tooltip } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  BellOutlined,
} from "@ant-design/icons";
import FavoritesDropdown from "@components/FavoritesDropdown/FavoritesDropdown";
import UnauthenticatedFavoritesDropdown from "@components/FavoritesDropdown/UnauthenticatedFavoritesDropdown";
import NotificationCenter from "@components/Notification/Center/NotificationCenter";
import UnauthenticatedNotificationCenter from "@components/Notification/UnauthenticatedCenter/UnauthenticatedNotificationCenter";
import UnauthenticatedChatButton from "@components/Chat/UnauthenticatedChatButton/index";
import ChatButton from "@components/Chat/ChatButton/index";
import "./MobileHeaderAction.scss";

const MobileHeaderAction = ({
  isLoggedIn,
  user,
  isMember,
  handleLoginRequire,
  onLoginClick,
  MANAGE_LISTINGS_PATH,
  MANAGE_CONSIGNMENTS_PATH,
  CREATE_LISTING_PATH,
}) => {
  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";
  const avatarSrc = user?.avatar || user?.avatarUrl;
  const avatarName = displayName;

  return (
    <div
      className="mobile-header-action"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        padding: "8px 0",
      }}
    >
      {/* Icons row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {/* Heart Icon */}
        {isLoggedIn ? (
          <div className="mobile-icon-wrapper">
            <FavoritesDropdown />
          </div>
        ) : (
          <div className="mobile-icon-wrapper">
            <UnauthenticatedFavoritesDropdown onLoginClick={onLoginClick} />
          </div>
        )}

        {/* Message Icon */}
        {isLoggedIn ? (
          <div className="mobile-icon-wrapper">
            <ChatButton iconSize="20px" buttonSize="48px" />
          </div>
        ) : (
          <div className="mobile-icon-wrapper">
            <UnauthenticatedChatButton onLoginClick={onLoginClick} />
          </div>
        )}

        {/* Bell Icon */}
        {isLoggedIn ? (
          <div className="mobile-icon-wrapper">
            <NotificationCenter />
          </div>
        ) : (
          <div className="mobile-icon-wrapper">
            <UnauthenticatedNotificationCenter onLoginClick={onLoginClick} />
          </div>
        )}
      </div>

      {/* Member buttons */}
      {isMember && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Nút Đăng tin - Luôn hiển thị */}
          <Button
            block
            type="text"
            onClick={() =>
              handleLoginRequire(
                CREATE_LISTING_PATH,
                "Vui lòng đăng nhập để đăng tin"
              )
            }
          >
            Đăng tin
          </Button>

          {/* Ký gửi - Chỉ hiện khi đã đăng nhập */}
          {isLoggedIn && (
            <>
              <Button
                block
                type="text"
                onClick={() =>
                  handleLoginRequire(
                    MANAGE_CONSIGNMENTS_PATH,
                    "Vui lòng đăng nhập để ký gửi"
                  )
                }
              >
                Ký gửi
              </Button>
            </>
          )}
        </div>
      )}

      {/* User profile or login */}
      {isLoggedIn ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #d9d9d9",
          }}
        >
          <Avatar
            src={avatarSrc}
            icon={<UserOutlined />}
            size={40}
            style={{
              backgroundColor: avatarSrc ? "transparent" : "#1890ff",
            }}
          >
            {!avatarSrc ? avatarName?.charAt(0)?.toUpperCase() : null}
          </Avatar>
          <span
            style={{
              fontSize: "16px",
              color: "#262626",
              fontWeight: "500",
            }}
          >
            {displayName}
          </span>
        </div>
      ) : (
        <Button
          type="primary"
          onClick={onLoginClick}
          block
          size="large"
          style={{
            borderRadius: "12px",
            height: "48px",
            fontWeight: "500",
          }}
        >
          Đăng nhập
        </Button>
      )}
    </div>
  );
};

export default MobileHeaderAction;
