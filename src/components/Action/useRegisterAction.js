import { useState, useRef } from "react";
import { message } from "antd";
import { requestOtp } from "@services/otpService";
import { createAccount } from "@services/accountService";

export const useRegisterAction = (login) => {
  const [openRegister, setOpenRegister] = useState(false);
  const [openRegisterForm, setOpenRegisterForm] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const phoneRegisterRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegisterContinue = async (phone, onOtpSent) => {
    if (!phone) return;
    try {
      setRegisterSubmitting(true);
      phoneRegisterRef.current?.clearErrors?.();
      await requestOtp({ phoneNumber: phone, type: "REGISTER" });
      onOtpSent(phone, "REGISTER");
      messageApi.success("Đã gửi mã OTP");
      setOpenRegister(false);
    } catch (e) {
      phoneRegisterRef.current?.setFieldErrors?.(e?.fieldErrors || {});
      messageApi.error(e?.message || "Không thể gửi OTP");
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const handleRegisterSubmit = async ({ fullName, password }, tokenOtp) => {
    try {
      const { accessToken, refreshToken } = await createAccount({
        tempToken: tokenOtp,
        fullName,
        password,
      });
      await login({ accessToken, refreshToken });
      messageApi.success("Đăng ký thành công");
      setOpenRegisterForm(false);
    } catch (e) {
      messageApi.error(e?.message || "Đăng ký thất bại");
    }
  };

  return {
    openRegister,
    setOpenRegister,
    openRegisterForm,
    setOpenRegisterForm,
    registerSubmitting,
    phoneRegisterRef,
    handleRegisterContinue,
    handleRegisterSubmit,
    contextHolder,
  };
};
