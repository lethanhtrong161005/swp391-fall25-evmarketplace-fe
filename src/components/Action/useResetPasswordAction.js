import { useState, useRef } from "react";
import { message } from "antd";
import { requestOtp } from "@services/otpService";
import { resetPassword } from "@services/accountService";

export const useResetPasswordAction = () => {
  const [openResetPhone, setOpenResetPhone] = useState(false);
  const [openResetForm, setOpenResetForm] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetPwdSubmitting, setResetPwdSubmitting] = useState(false);
  const phoneResetRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleResetContinue = async (phone, onOtpSent) => {
    if (!phone) return;
    try {
      setResetSubmitting(true);
      phoneResetRef.current?.clearErrors?.();
      await requestOtp({ phoneNumber: phone, type: "RESET" });
      onOtpSent(phone, "RESET");
      messageApi.success("Đã gửi mã OTP");
    } catch (e) {
      phoneResetRef.current?.setFieldErrors?.(e?.fieldErrors || {});
      messageApi.error(e?.message || "Không thể gửi OTP");
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async ({ newPassword }, tokenOtp, setOpenLogin) => {
    try {
      setResetPwdSubmitting(true);
      await resetPassword({ token: tokenOtp, newPassword });
      messageApi.success("Đặt lại mật khẩu thành công");
      setOpenResetForm(false);
      setOpenLogin(true);
    } catch (e) {
      messageApi.error(e?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setResetPwdSubmitting(false);
    }
  };

  return {
    openResetPhone,
    setOpenResetPhone,
    openResetForm,
    setOpenResetForm,
    resetSubmitting,
    resetPwdSubmitting,
    phoneResetRef,
    handleResetContinue,
    handleResetPasswordSubmit,
    contextHolder,
  };
};
