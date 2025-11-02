import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Menu, Button, Drawer, Grid } from "antd";
import HeaderAction from "@components/Action/HeaderAction";
import MobileHeaderAction from "@components/Action/MobileHeaderAction";
import { useHeaderAction } from "@components/Action/useHeaderAction";
import LoginModal from "@components/Modal/LoginModal";
import PhoneRegisterModal from "@components/Modal/PhoneRegisterModal";
import PhoneResetPasswordModal from "@components/Modal/PhoneResetPasswordModal";
import ResetPasswordModal from "@components/Modal/ResetPasswordModal";
import OtpVerifyModal from "@components/Modal/OtpVerifyModal";
import RegisterModal from "@components/Modal/RegisterModal";

const items = [
  { key: "home", label: "Trang chủ", path: "/" },
  { key: "vehicle", label: "Phương tiện", path: "/vehicle" },
  { key: "battery", label: "Pin", path: "/battery" },
];

const { useBreakpoint } = Grid;

const HeaderNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại
  const [current, setCurrent] = useState("home");
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();

  // Get auth data for mobile drawer
  const {
    auth,
    otp,
    register,
    reset,
    handleOtpSuccess,
    handleOtpStart,
    handleLoginSubmit,
  } = useHeaderAction();
  const { isLoggedIn, user, handleLoginRequire } = auth;
  const isMember = !user?.role || user?.role?.toUpperCase() === "MEMBER";

  const MANAGE_LISTINGS_PATH = "/my-ads";
  const MANAGE_CONSIGNMENTS_PATH = "/consignment";
  const CREATE_LISTING_PATH = "/listing/new";

  useEffect(() => {
    // Tìm trong mảng items phần tử có path trùng với URL hiện tại
    const matchedItem = items.find((item) => item.path === location.pathname);

    // Nếu tìm thấy item khớp
    if (matchedItem) {
      // Cập nhật state current = key của item đó (để Menu highlight đúng)
      setCurrent(matchedItem.key);
    }

    // useEffect sẽ chạy lại mỗi khi URL (location.pathname) thay đổi
  }, [location.pathname]);

  const onClick = (e) => {
    setCurrent(e.key); // Đánh dấu menu đang chọn
    const selectedItem = items.find((item) => item.key === e.key); // Lấy item theo key
    if (selectedItem) {
      navigate(selectedItem.path); // Điều hướng sang trang mới
    }
    setOpen(false); // Đóng drawer khi click *mobile
  };

  return (
    <>
      {/* mobile */}
      {!screens.lg && (
        <>
          <Button
            className="menu-button"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />

          <Drawer
            title="Danh mục"
            placement="left"
            onClose={() => setOpen(false)}
            open={open}
          >
            <Menu
              mode="vertical"
              selectedKeys={[current]}
              items={items}
              onClick={onClick}
            />
            {/* actions hiển thị trong drawer */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <MobileHeaderAction
                isLoggedIn={isLoggedIn}
                user={user}
                isMember={isMember}
                handleLoginRequire={handleLoginRequire}
                onLoginClick={() => auth.setOpenLogin?.(true)}
                MANAGE_LISTINGS_PATH={MANAGE_LISTINGS_PATH}
                MANAGE_CONSIGNMENTS_PATH={MANAGE_CONSIGNMENTS_PATH}
                CREATE_LISTING_PATH={CREATE_LISTING_PATH}
              />
            </div>
          </Drawer>
        </>
      )}

      {/* desktop */}
      {screens.lg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "24px",
          }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            items={items}
            onClick={onClick}
            style={{
              flex: 1,
              borderBottom: "none",
              display: "flex",
              alignItems: "center",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <HeaderAction />
          </div>
        </div>
      )}

      {/* Auth Modals for mobile */}
      {!screens.lg && (
        <>
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
        </>
      )}
    </>
  );
};

export default HeaderNavbar;
