import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import LoginModal from "@components/Modal/LoginModal";
import PhoneRegisterModal from "@components/Modal/PhoneRegisterModal";
import PhoneResetPasswordModal from "@components/Modal/PhoneResetPasswordModal";
import ResetPasswordModal from "@components/Modal/ResetPasswordModal";
import OtpVerifyModal from "@components/Modal/OtpVerifyModal";
import RegisterModal from "@components/Modal/RegisterModal";
import { requestOtp, verifyOtp } from "@services/otpService";
import { createAccount, resetPassword } from "@services/accountService";
import { useAuth } from "@hooks/useAuth";

const HeaderAction = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [openRegisterForm, setOpenRegisterForm] = useState(false);
  const [openResetPhone, setOpenResetPhone] = useState(false);
  const [openResetForm, setOpenResetForm] = useState(false);



  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetPwdSubmitting, setResetPwdSubmitting] = useState(false);
  const [regPhone, setRegPhone] = useState("");

  const phoneRegisterRef = useRef(null);
  const phoneResetRef = useRef(null);
  const otpRef = useRef(null);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpResendSubmitting, setOtpResendSubmitting] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState(null); // 'register' | 'reset'

  const [tokenOtp, setTokenOtp] = useState("");

  const menuItems = [
    { key: "infouser", label: "Hồ sơ", path: "/infouser" },
    { key: "logout", label: "Đăng xuất", path: "/logout" },
  ];

  const handleMenuClick = async ({ key }) => {
    if (key === "infouser") navigate("/info-user");
    if (key === "logout") await logout();
  };

  const handleLoginSubmit = async (dto) => {
    await login(dto);
    return true;
  };

  // ===== Nhập SĐT → gửi OTP → nếu OK thì mở OTP modal =====
  // Nhập SĐT → gửi OTP → thành công mở OTP
  const handleRegisterContinue = async (phone) => {
    if (!phone) return;
    try {
      setRegisterSubmitting(true);
      phoneRegisterRef.current?.clearErrors?.();

      await requestOtp({ phoneNumber: phone, type: "REGISTER" });
      setRegPhone(phone);               // show trong OTP modal
      setOpenRegister(false);           // đóng modal nhập SĐT
      setOtpPurpose('REGISTER');
      setOpenOtp(true);                 // mở modal OTP
      messageApi.success("Đã gửi mã OTP");
    } catch (e) {
      phoneRegisterRef.current?.setFieldErrors?.(e?.fieldErrors || {});
      messageApi.error(e?.message || "Không thể gửi OTP", 1.4);
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const handleResetContinue = async (phone) => {
    if (!phone) return;
    try {
      setResetSubmitting(true);
      phoneResetRef.current?.clearErrors?.();
      await requestOtp(
        {
          phoneNumber: phone,
          type: "RESET"
        }
      );
      setRegPhone(phone);
      setOtpPurpose('RESET');
      setOpenResetPhone(false);
      setOpenOtp(true);
      messageApi.success("Đã gửi mã OTP");
    } catch (e) {
      phoneResetRef.current?.setFieldErrors?.(e?.fieldErrors || {});
      messageApi.error(e?.message || "Không thể gửi OTP", 1.4);
    } finally {
      setResetSubmitting(false);
    }
  };

  // ===== Xác thực OTP (tuỳ bạn gắn API thật) =====
  const handleOtpVerify = async (code) => {
    try {
      setOtpSubmitting(true);
      otpRef.current?.clearErrors?.();

      const data = await verifyOtp({ phoneNumber: regPhone, otp: code });
      if (data) {
        setTokenOtp(data);
      }

      messageApi.success("Xác thực OTP thành công");
      setOpenOtp(false);
      if (otpPurpose === "REGISTER") {
        setOpenRegisterForm(true);
      } else if (otpPurpose === "RESET") {
        setOpenResetForm(true);
      }
    } catch (e) {
      otpRef.current?.setFieldErrors?.({ otp: [e?.message || "Mã OTP không hợp lệ"] });
      messageApi.error(e?.message || "Mã OTP không hợp lệ");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOtpResend = async () => {
    try {
      setOtpResendSubmitting(true);
      await requestOtp({
        phoneNumber: regPhone,
        type: otpPurpose,
      });
      messageApi.success("Đã gửi lại mã OTP");
    } catch (e) {
      messageApi.error(e?.message || "Không thể gửi lại mã");
    } finally {
      setOtpResendSubmitting(false);
    }
  };

  const handleRegisterSubmit = async ({ fullName, password }) => {
    try {
      const { accessToken, refreshToken } = await createAccount(
        {
          tempToken: tokenOtp,
          fullName,
          password
        }
      )
      await login({ accessToken, refreshToken });
      messageApi.success("Đăng ký tài khoản thành công");
      setOpenRegisterForm(false);
    } catch (e) {
      messageApi.error(e?.message || "Đăng ký tài khoản thất bại");
    }


  };

  // ===== Reset password submit (nhận { newPassword })
  const handleResetPasswordSubmit = async ({ newPassword }) => {
    try {
      setResetPwdSubmitting(true);
      await resetPassword(
        {
          token: tokenOtp,
          newPassword: newPassword
        }
      )
      messageApi.success("Đặt lại mật khẩu thành công");
      setOpenResetForm(false);
      setOpenLogin(true); // cho user đăng nhập lại
    } catch (e) {
      messageApi.error(e?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setResetPwdSubmitting(false);
    }
  };


  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {contextHolder}

      <Button>Đăng tin</Button>

      {isLoggedIn ? (
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" trigger={["click"]}>
          <Button icon={<UserOutlined />} type="text">{displayName}</Button>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={() => setOpenLogin(true)}>Đăng nhập</Button>
      )}

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSubmit={handleLoginSubmit}
        onGoRegister={() => { setOpenLogin(false); setOpenRegister(true); }}
        onForgot={(prefillPhone) => {
          if (prefillPhone) setRegPhone(prefillPhone);
          setOpenLogin(false);
          setOpenResetPhone(true);
        }}
      />

      <PhoneRegisterModal
        ref={phoneRegisterRef}
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onContinue={handleRegisterContinue}
        submitting={registerSubmitting}
        onGoLogin={() => { setOpenRegister(false); setOpenLogin(true); }}
      />

      <PhoneResetPasswordModal
        ref={phoneResetRef}
        open={openResetPhone}
        onClose={() => setOpenResetPhone(false)}
        onContinue={handleResetContinue}
        submitting={resetSubmitting}
        onGoLogin={() => { setOpenResetPhone(false); setOpenLogin(true); }}
      />

      <OtpVerifyModal
        ref={otpRef}
        open={openOtp}
        phone={regPhone}
        onClose={() => setOpenOtp(false)}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        cooldownSec={30}
        submitting={otpSubmitting}
        resendSubmitting={otpResendSubmitting}
      />

      <RegisterModal
        open={openRegisterForm}
        phone={regPhone}
        onClose={() => setOpenRegisterForm(false)}
        onSubmit={handleRegisterSubmit}
        onGoLogin={() => { setOpenRegisterForm(false); setOpenLogin(true); }}
      />

      <ResetPasswordModal
        open={openResetForm}
        onClose={() => setOpenResetForm(false)}
        onSubmit={handleResetPasswordSubmit}
        submitting={resetPwdSubmitting}
        onGoLogin={() => { setOpenResetForm(false); setOpenLogin(true); }}
      />
    </div>
  );
};

export default HeaderAction;

