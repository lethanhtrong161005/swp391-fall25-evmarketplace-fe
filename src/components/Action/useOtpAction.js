import { message } from "antd";
import { useRef, useState } from "react";
import { requestOtp, verifyOtp } from "@services/otpService";

export const useOtpAction = () => {
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpResendSubmitting, setOtpResendSubmitting] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState(null);
  const [tokenOtp, setTokenOtp] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [openOtp, setOpenOtp] = useState(false);
  const otpRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOtpVerify = async (code, onSuccess) => {
    try {
      setOtpSubmitting(true);
      otpRef.current?.clearErrors?.();
      const data = await verifyOtp({ phoneNumber: regPhone, otp: code });
      if (data) setTokenOtp(data);
      messageApi.success("Xác thực OTP thành công");
      onSuccess(otpPurpose);
    } catch (e) {
      otpRef.current?.setFieldErrors?.({ otp: [e.message || "Mã OTP sai"] });
      messageApi.error(e?.message || "Mã OTP không hợp lệ");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOtpResend = async () => {
    try {
      setOtpResendSubmitting(true);
      await requestOtp({ phoneNumber: regPhone, type: otpPurpose });
      messageApi.success("Đã gửi lại mã OTP");
    } catch (e) {
      messageApi.error(e?.message || "Không thể gửi lại mã");
    } finally {
      setOtpResendSubmitting(false);
    }
  };

  return {
    otpRef,
    otpPurpose,
    setOtpPurpose,
    tokenOtp,
    regPhone,
    setRegPhone,
    openOtp,
    setOpenOtp,
    otpSubmitting,
    otpResendSubmitting,
    handleOtpVerify,
    handleOtpResend,
    contextHolder,
  };
};
