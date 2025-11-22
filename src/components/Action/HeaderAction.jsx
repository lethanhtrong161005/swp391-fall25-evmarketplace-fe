import React from "react";
import { Button, Dropdown, Avatar, Grid, Space } from "antd";
import { Divider } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

import FavoritesDropdown from "@components/FavoritesDropdown/FavoritesDropdown";
import UnauthenticatedFavoritesDropdown from "@components/FavoritesDropdown/UnauthenticatedFavoritesDropdown";
import NotificationCenter from "@components/Notification/Center/NotificationCenter";
import UnauthenticatedNotificationCenter from "@components/Notification/UnauthenticatedCenter/UnauthenticatedNotificationCenter";
import UnauthenticatedChatButton from "@components/Chat/UnauthenticatedChatButton/index";
import ChatButton from "@components/Chat/ChatButton/index";

import { useUserProfile } from "@hooks/useUserProfile";
import { getAvatarUrl } from "@utils/userDataUtils";
import "./HeaderAction.scss";

const MANAGE_LISTINGS_PATH = "/my-ads";
const MANAGE_CONSIGNMENTS_PATH = "/consignment";
const CREATE_LISTING_PATH = "/listing/new";

const HeaderAction = ({
  isLoggedIn = false,
  user: authUser = null,
  contextHolder = null,
  getMenuItems = () => [],
  handleMenuClick = () => {},
  handleLoginRequire = () => {},
  onLoginClick = () => {},
}) => {
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const { user: enhancedUser } = useUserProfile();
  const user = enhancedUser || authUser;

  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";
  const menuItems = getMenuItems();
  const isMember = !user?.role || user?.role?.toUpperCase() === "MEMBER";

  const avatarSrc = getAvatarUrl(user);
  const avatarName = displayName?.charAt(0)?.toUpperCase();

  const dropdownItems = [
    {
      key: "header",
      label: (
        <div className="profile-dropdown-header">
          <div className="profile-dropdown-avatar">
            <Avatar
              src={avatarSrc}
              icon={<UserOutlined />}
              size={48}
              style={{
                backgroundColor: avatarSrc ? "transparent" : "#1890ff",
              }}
            >
              {!avatarSrc ? avatarName?.charAt(0)?.toUpperCase() : null}
            </Avatar>
          </div>
          <div className="profile-dropdown-name">{displayName}</div>
        </div>
      ),
      disabled: true,
      style: {
        cursor: "default",
        padding: 0,
        backgroundColor: "transparent",
      },
    },
    { type: "divider" },
    ...menuItems.map((item) => {
      if (item.type === "divider") {
        return { type: "divider" };
      }

      return {
        key: item.key,
        label: (
          <div
            className={`profile-menu-item ${
              item.danger ? "profile-menu-item-danger" : ""
            }`}
          >
            {item.icon && (
              <span className="profile-menu-icon">{item.icon}</span>
            )}
            <span className="profile-menu-label">{item.label}</span>
          </div>
        ),
        danger: item.danger,
        onClick: () => handleMenuClick({ key: item.key }),
      };
    }),
  ];

  const getDropdownPlacement = () => {
    if (screens.xs || (screens.sm && !screens.md)) {
      return "bottomLeft";
    }
    if (screens.md && !screens.lg) {
      return "bottomRight";
    }
    return "bottomRight";
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {contextHolder}

        {isDesktop && isMember && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button
              type="text"
              className="header-text-button"
              onClick={() =>
                handleLoginRequire(
                  "/listing/new",
                  "Vui lòng đăng nhập để đăng tin"
                )
              }
            >
              Đăng tin
            </Button>

            {isLoggedIn && (
              <Button
                type="text"
                className="header-text-button"
                onClick={() =>
                  handleLoginRequire(
                    "/consignment",
                    "Vui lòng đăng nhập để ký gửi"
                  )
                }
              >
                Ký gửi
              </Button>
            )}
          </div>
        )}

        <Space size={8}>
          {isLoggedIn ? (
            <FavoritesDropdown />
          ) : (
            <UnauthenticatedFavoritesDropdown onLoginClick={onLoginClick} />
          )}

          {isLoggedIn ? (
            <ChatButton />
          ) : (
            <UnauthenticatedChatButton onLoginClick={onLoginClick} />
          )}

          {isLoggedIn ? (
            <NotificationCenter />
          ) : (
            <UnauthenticatedNotificationCenter onLoginClick={onLoginClick} />
          )}
        </Space>

        {isLoggedIn ? (
          <Dropdown
            menu={{
              items: dropdownItems,
            }}
            trigger={["click"]}
            placement={getDropdownPlacement()}
            overlayClassName="profile-dropdown-overlay"
            getPopupContainer={() => {
              return document.body;
            }}
            destroyOnHidden={false}
            content={
              <div className="profile-popover-container">
                <div className="profile-dropdown-header">
                  <Avatar
                    src={avatarSrc}
                    icon={<UserOutlined />}
                    size={48}
                    style={{
                      backgroundColor: avatarSrc ? "transparent" : "#1890ff",
                      marginBottom: 8,
                    }}
                  >
                    {!avatarSrc && avatarName}
                  </Avatar>
                  <div className="profile-dropdown-name">{displayName}</div>
                </div>

                <Divider style={{ margin: 0 }} />

                <div className="profile-menu-list">
                  {menuItems.map((item) => {
                    if (item.type === "divider") {
                      return (
                        <Divider
                          key={item.key || Math.random()}
                          style={{ margin: 0 }}
                        />
                      );
                    }

                    return (
                      <div
                        key={item.key}
                        className={`profile-menu-item ${
                          item.danger ? "profile-menu-item-danger" : ""
                        }`}
                        onClick={() => handleMenuClick({ key: item.key })}
                      >
                        {item.icon && (
                          <span className="profile-menu-icon">{item.icon}</span>
                        )}
                        <span className="profile-menu-label">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          >
            <div className="header-avatar-container">
              <Avatar
                src={avatarSrc}
                icon={<UserOutlined />}
                size={40}
                style={{
                  backgroundColor: avatarSrc ? "transparent" : "#1890ff",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onError={(e) => {
                  console.error("Avatar load error:", {
                    avatarSrc,
                    error: e,
                    user: user,
                  });
                  if (e?.target) {
                    e.target.style.display = "none";
                  }
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {!avatarSrc && avatarName}
              </Avatar>
            </div>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            onClick={onLoginClick}
            style={{
              borderRadius: "20px",
              height: "40px",
              padding: "0 24px",
              fontWeight: "500",
            }}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </>
  );
};

export default HeaderAction;
