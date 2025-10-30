import React from "react";
import { Button, Dropdown, Avatar, Grid } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

import LoginModal from "@components/Modal/LoginModal";
import PhoneRegisterModal from "@components/Modal/PhoneRegisterModal";
import PhoneResetPasswordModal from "@components/Modal/PhoneResetPasswordModal";
import ResetPasswordModal from "@components/Modal/ResetPasswordModal";
import OtpVerifyModal from "@components/Modal/OtpVerifyModal";
import RegisterModal from "@components/Modal/RegisterModal";
import FavoritesDropdown from "@components/FavoritesDropdown/FavoritesDropdown";
import NotificationCenter from "@components/Notification/Center/NotificationCenter";

import { useHeaderAction } from "./useHeaderAction";

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
          gap: "24px", // Khoảng cách lớn giữa các nhóm chức năng
        }}
      >
        {contextHolder}

        {/* Nhóm Button - Desktop only */}
        {isDesktop && isMember && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Khoảng cách nhỏ giữa các button
            }}
          >
            <Button
              onClick={() =>
                handleLoginRequire(
                  CREATE_LISTING_PATH,
                  "Vui lòng đăng nhập để đăng tin"
                )
              }
            >
              Đăng tin
            </Button>

            <Button
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
              onClick={() =>
                handleLoginRequire(
                  MANAGE_CONSIGNMENTS_PATH,
                  "Vui lòng đăng nhập để ký gửi"
                )
              }
            >
              Ký gửi
            </Button>
          </div>
        )}

        {/* Nhóm Icon */}
        {isLoggedIn && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Khoảng cách nhỏ giữa các icon
            }}
          >
            <NotificationCenter />
            <FavoritesDropdown />
          </div>
        )}

        {/* Khối Người dùng */}
        {isLoggedIn ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <Avatar src={avatarSrc} icon={<UserOutlined />} size="small">
                  {!avatarSrc ? avatarName?.charAt(0)?.toUpperCase() : null}
                </Avatar>
                {isDesktop && (
                  <span style={{ fontSize: "14px", color: "#262626" }}>
                    {displayName}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        ) : (
          isDesktop && (
            <Button type="primary" onClick={() => auth.setOpenLogin?.(true)}>
              Đăng nhập
            </Button>
          )
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
