import React from "react";
import { Button, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

import LoginModal from "@components/Modal/LoginModal";
import PhoneRegisterModal from "@components/Modal/PhoneRegisterModal";
import PhoneResetPasswordModal from "@components/Modal/PhoneResetPasswordModal";
import ResetPasswordModal from "@components/Modal/ResetPasswordModal";
import OtpVerifyModal from "@components/Modal/OtpVerifyModal";
import RegisterModal from "@components/Modal/RegisterModal";

import { useHeaderAction } from "./useHeaderAction";

const MANAGE_LISTINGS_PATH = "/my-ads"; // đổi path nếu bạn dùng route khác

const HeaderAction = () => {
  const { auth, otp, register, reset, handleOtpSuccess, handleOtpStart } =
    useHeaderAction();

  const {
    isLoggedIn,
    user,
    contextHolder,
    getMenuItems,
    handleMenuClick,
    handleLoginRequire,
    handleLoginSubmit,
  } = auth;

  // // ⬇️ click “Quản lý tin”
  // const handleClickManageListing = () => {
  //   if (isLoggedIn) {
  //     navigate(MANAGE_LISTINGS_PATH);
  //   } else {
  //     auth.setRedirectAfterLogin(MANAGE_LISTINGS_PATH);
  //     messageApi.info("Vui lòng đăng nhập để quản lý tin");
  //     setOpenLogin(true);
  //   }
  // };

  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";
  const menuItems = getMenuItems();
  const isMember = !user?.role || user?.role?.toUpperCase() === "MEMBER";

  return (
    <>
      <div style={{ display: "flex", gap: 8 }}>
        {contextHolder}
        {isMember && (
          <>
            <Button
              onClick={() =>
                handleLoginRequire(
                  "/listing/new",
                  "Vui lòng đăng nhập để đăng tin"
                )
              }
            >
              Đăng tin
            </Button>

            <Button
              onClick={() =>
                handleLoginRequire(
                  "/my-ads",
                  "Vui lòng đăng nhập để quản lý tin"
                )
              }
            >
              Quản lý tin
            </Button>

            <Button>Ký gửi</Button>
          </>
        )}

        {isLoggedIn ? (
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button icon={<UserOutlined />} type="text">
              {displayName}
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => auth.setOpenLogin?.(true)}>
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
