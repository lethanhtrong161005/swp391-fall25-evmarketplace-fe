import React from "react";
import { Button, Popover, Avatar, Grid, Tooltip, Space, Divider } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

import LoginModal from "@components/Modal/LoginModal";
import PhoneRegisterModal from "@components/Modal/PhoneRegisterModal";
import PhoneResetPasswordModal from "@components/Modal/PhoneResetPasswordModal";
import ResetPasswordModal from "@components/Modal/ResetPasswordModal";
import OtpVerifyModal from "@components/Modal/OtpVerifyModal";
import RegisterModal from "@components/Modal/RegisterModal";
import FavoritesDropdown from "@components/FavoritesDropdown/FavoritesDropdown";
import UnauthenticatedFavoritesDropdown from "@components/FavoritesDropdown/UnauthenticatedFavoritesDropdown";
import NotificationCenter from "@components/Notification/Center/NotificationCenter";
import UnauthenticatedNotificationCenter from "@components/Notification/UnauthenticatedCenter/UnauthenticatedNotificationCenter";
import UnauthenticatedChatButton from "@components/Chat/UnauthenticatedChatButton";

import { useHeaderAction } from "./useHeaderAction";
import "./HeaderAction.scss";

const MANAGE_LISTINGS_PATH = "/my-ads";
const MANAGE_CONSIGNMENTS_PATH = "/consignment";
const CREATE_LISTING_PATH = "/listing/new";

const HeaderAction = () => {
  const { auth, otp, register, reset, handleOtpSuccess, handleOtpStart } =
    useHeaderAction();

  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const {
    isLoggedIn,
    user,
    contextHolder,
    getMenuItems,
    handleMenuClick,
    handleLoginRequire,
    handleLoginSubmit,
  } = auth;

  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";
  const menuItems = getMenuItems();
  const isMember = !user?.role || user?.role?.toUpperCase() === "MEMBER";

  // Avatar logic
  const avatarSrc = user?.avatar || user?.avatarUrl;
  const avatarName = displayName;

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

        {/* Nhóm Button - Desktop only khi là member */}
        {isDesktop && isMember && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Nút Đăng tin - Luôn hiển thị */}
            <Button
              type="text"
              className="header-text-button"
              onClick={() =>
                handleLoginRequire(
                  CREATE_LISTING_PATH,
                  "Vui lòng đăng nhập để đăng tin"
                )
              }
            >
              Đăng tin
            </Button>

            {/* Quản lý tin và Ký gửi - Chỉ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <>
                <Button
                  type="text"
                  className="header-text-button"
                  onClick={() =>
                    handleLoginRequire(
                      MANAGE_LISTINGS_PATH,
                      "Vui lòng đăng nhập để quản lý tin"
                    )
                  }
                >
                  Quản lý tin
                </Button>

                <Button
                  type="text"
                  className="header-text-button"
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

        {/* Nhóm Icon với kiểu mới */}
        <Space size={8}>
          {/* Icon Favorited - Heart */}
          {isLoggedIn ? (
            <FavoritesDropdown />
          ) : (
            <UnauthenticatedFavoritesDropdown
              onLoginClick={() => auth.setOpenLogin?.(true)}
            />
          )}

          {/* Icon Chat - Message */}
          {isLoggedIn ? (
            <Tooltip title="Chat">
              <Button
                type="text"
                icon={<MessageOutlined style={{ fontSize: "18px" }} />}
                onClick={() => {
                  // TODO: Navigate to chat page when implemented
                }}
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
          ) : (
            <UnauthenticatedChatButton
              onLoginClick={() => auth.setOpenLogin?.(true)}
            />
          )}

          {/* Icon Notification - Bell */}
          {isLoggedIn ? (
            <NotificationCenter />
          ) : (
            <UnauthenticatedNotificationCenter
              onLoginClick={() => auth.setOpenLogin?.(true)}
            />
          )}
        </Space>

        {/* Khối Người dùng */}
        {isLoggedIn ? (
          <Popover
            content={
              <div className="profile-popover-container">
                {/* Header với Avatar và Tên */}
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

                <Divider style={{ margin: 0 }} />

                {/* Menu Items */}
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
            title={null}
            trigger="click"
            placement="bottomRight"
            overlayClassName="profile-popover-overlay"
          >
            <div className="header-avatar-container">
              <Avatar
                src={avatarSrc}
                icon={<UserOutlined />}
                size={40}
                style={{
                  backgroundColor: avatarSrc ? "transparent" : "#1890ff",
                  cursor: "pointer",
                }}
              >
                {!avatarSrc ? avatarName?.charAt(0)?.toUpperCase() : null}
              </Avatar>
            </div>
          </Popover>
        ) : (
          <Button
            type="primary"
            onClick={() => auth.setOpenLogin?.(true)}
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

        <LoginModal
          open={auth.openLogin}
          onClose={() => auth.setOpenLogin(false)}
          onSubmit={handleLoginSubmit}
          onGoRegister={() => {
            auth.setOpenLogin(false);
            register.setOpenRegister(true);
          }}
          onForgot={(prefillPhone) => {
            if (prefillPhone) otp.setRegPhone(prefillPhone);
            auth.setOpenLogin(false);
            reset.setOpenResetPhone(true);
          }}
        />

        <PhoneRegisterModal
          ref={register.phoneRegisterRef}
          open={register.openRegister}
          onClose={() => register.setOpenRegister(false)}
          onContinue={(phone) =>
            register.handleRegisterContinue(phone, handleOtpStart)
          }
          submitting={register.registerSubmitting}
          onGoLogin={() => {
            register.setOpenRegister(false);
            auth.setOpenLogin(true);
          }}
        />

        <PhoneResetPasswordModal
          ref={reset.phoneResetRef}
          open={reset.openResetPhone}
          onClose={() => reset.setOpenResetPhone(false)}
          onContinue={(phone) =>
            reset.handleResetContinue(phone, handleOtpStart)
          }
          submitting={reset.resetSubmitting}
          onGoLogin={() => {
            reset.setOpenResetPhone(false);
            auth.setOpenLogin(true);
          }}
        />

        <OtpVerifyModal
          ref={otp.otpRef}
          open={otp.openOtp}
          phone={otp.regPhone}
          onClose={() => otp.setOpenOtp(false)}
          onVerify={(code) => otp.handleOtpVerify(code, handleOtpSuccess)}
          onResend={otp.handleOtpResend}
          cooldownSec={30}
          submitting={otp.otpSubmitting}
          resendSubmitting={otp.otpResendSubmitting}
        />

        <RegisterModal
          open={register.openRegisterForm}
          phone={otp.regPhone}
          onClose={() => register.setOpenRegisterForm(false)}
          onSubmit={(formData) =>
            register.handleRegisterSubmit(formData, otp.tokenOtp)
          }
          onGoLogin={() => {
            register.setOpenRegisterForm(false);
            auth.setOpenLogin(true);
          }}
        />

        <ResetPasswordModal
          open={reset.openResetForm}
          onClose={() => reset.setOpenResetForm(false)}
          onSubmit={(formData) =>
            reset.handleResetPasswordSubmit(
              formData,
              otp.tokenOtp,
              register.setOpenLogin
            )
          }
          submitting={reset.resetPwdSubmitting}
          onGoLogin={() => {
            reset.setOpenResetForm(false);
            auth.setOpenLogin(true);
          }}
        />
      </div>
    </>
  );
};

export default HeaderAction;
